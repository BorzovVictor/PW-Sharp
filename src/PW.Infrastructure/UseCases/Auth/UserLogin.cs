using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public class UserLogin : UseCase<UserDto>, IUserLoginCase
    {
        private readonly AppSettings _appSettings;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<UserLogin> _logger;

        public UserLogin(IOptions<AppSettings> appSettings, AppDbContext context, IMapper mapper,
            ILogger<UserLogin> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _appSettings = appSettings.Value;
        }

        public async Task<ExecutionResult> Execute(UserLoginRequest request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(x =>
                    x.Email == request.Email && x.Password == request.Password);
                if (user.IsNullOrEmpty())
                    return Failure(new BaseError($"user not exists"));

                var token = TokenHelper.Generate(user, _appSettings.Secret);
                var result = _mapper.Map<UserDto>(user);
                result.Token = token;

                return Success(result);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.GetBaseException().Message);
                return Failure(new BaseError(e.GetBaseException().Message));
            }
        }

        // private string Generate(User user)
        // {
        //     var tokenHandler = new JwtSecurityTokenHandler();
        //     var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        //     var tokenDescriptor = new SecurityTokenDescriptor
        //     {
        //         Subject = new ClaimsIdentity(new Claim[]
        //         {
        //             new Claim(ClaimTypes.Name, user.Name),
        //             new Claim("Id", user.Id.ToString()),
        //             new Claim("FirstName", user.FirstName),
        //             new Claim("LastName", user.LastName),
        //             new Claim(ClaimTypes.Surname, $"{user.FirstName} {user.LastName}".Trim()),
        //         }),
        //         Expires = DateTime.UtcNow.AddDays(7),
        //         SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
        //             SecurityAlgorithms.HmacSha256Signature)
        //     };
        //     var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        //     var token = tokenHandler.WriteToken(securityToken);
        //     return token;
        // }
    }
}