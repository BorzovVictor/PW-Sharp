using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public class UserRepository : EfRepository, IUserRepository
    {
        private readonly IMapper _mapper;

        public UserRepository(AppDbContext db, IMapper mapper) : base(db)
        {
            _mapper = mapper;
        }

        public async Task<UserDto> GetUserForSession(UserLoginRequest login)
        {
            var result =
                await Db.Users.FirstOrDefaultAsync(x => x.Email == login.Email && x.Password == login.Password);
            return _mapper.Map<UserDto>(result);
        }

        public async Task<decimal> GetBalance(int userId)
        {
            var amount = await Db.Transactions.Where(x => x.Corresponded == userId).ToListAsync();
            var result = amount.Sum(a => a.Amount);
            return result;
        }

        public async Task UpdateCurrentBalance(int userId, decimal currentBalance, AppDbContext db = null, bool autoSave = false)
        {
            AppDbContext context = Db;
            if (!db.IsNullOrEmpty())
                context = db;
            
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            user.CurrentBalance = currentBalance;
            if (autoSave)
                await context.SaveChangesAsync();
        }
        
        public async Task<bool> UserExists(int userId)
        {
            var user = await Db.Users.FirstOrDefaultAsync(x => x.Id == userId);
            return user != null;
        }

        public async Task<UserDto> GetUserByEmail(string email)
        {
            var user = await Db.Users.FirstOrDefaultAsync(x => x.Email == email);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserInfoDto> GetUserInfoById(int userId)
        {
            var user = await Db.Users.FirstOrDefaultAsync(x => x.Id == userId);
            return _mapper.Map<UserInfoDto>(user);
        }

        public async Task<IEnumerable<PwUser>> LoadUsers(UserFilter filter, int? currentUserId)
        {
            if (filter.IsEmpty())
                return _mapper.Map<IEnumerable<PwUser>>(await Db.Users.AsNoTracking().ToListAsync());

            var query = Db.Users.AsNoTracking();
            if (filter.SearchValue?.Trim().Length >= 2)
                query = query.Where(x => x.Name.ToUpper().Contains(filter.SearchValue.Replace("\"", "").ToUpper().Trim()));
            if (filter.ExceptSelf && currentUserId.HasValue)
                query = query.Where(x => x.Id != currentUserId);
            if (filter.Take >= 0)
            {
                query = query.Take(filter.Take.Value);
                if (filter.Skip >= 0)
                    query = query.Skip(filter.Skip.Value);
            }
            var data  = await query.ToListAsync();
            return _mapper.Map<IEnumerable<PwUser>>(data);
        }
    }
}