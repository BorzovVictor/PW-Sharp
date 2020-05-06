using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PW.Core;
using PW.Core.Entities;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public class UserRegister : UseCase<UserDto>, IUserRegisterCase
    {
        private readonly AppSettings _appSettings;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<UserRegister> _logger;
        private readonly ITransferDocumentRepository _documentRepository;

        public UserRegister(IOptions<AppSettings> appSettings, AppDbContext context, IMapper mapper,
            ILogger<UserRegister> logger, ITransferDocumentRepository documentRepository)
        {
            _appSettings = appSettings.Value;
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _documentRepository = documentRepository;
        }

        public async Task<ExecutionResult> Execute(UserRegisterRequest request)
        {
            // create transaction
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // check existing user
                var existingUser =
                    await _context.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == request.Email.ToLower().Trim());
                if (!existingUser.IsNullOrEmpty())
                    return Failure(new BaseError($"user with email: {request.Email} already exists"));
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                    return Failure(new BaseError("You must send username and password"));

                // create new user
                var user = new User
                {
                    Email = request.Email.Trim().ToLower(),
                    Name = request.UserName.Trim(),
                    Password = request.Password
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // set start balance
                var creditDoc = new TransferDocumentRequest
                {
                    Amount = _appSettings.StartBalance,
                    Sender = -1,
                    Recipient = user.Id,
                    Description = "starting reward [System]"
                };
                await _documentRepository.CreateDocuments(creditDoc, _context);

                // generate token 
                var token = TokenHelper.Generate(user, _appSettings.Secret);
                var result = _mapper.Map<UserDto>(user);
                result.Token = token;
                
                transaction.Commit();

                return Success(result);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.GetBaseException().Message);
                transaction.Rollback();
                return Failure(new BaseError(e.GetBaseException().Message));
            }
        }
    }
}