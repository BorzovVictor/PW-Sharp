using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public class CreateNewDocument : UseCase<TransferDocumentDto>, ICreateNewDocumentCase
    {
        private readonly IUserRepository _userRepository;
        private readonly ITransferDocumentRepository _documentRepository;
        private readonly AppDbContext _context;
        private readonly ILogger<CreateNewDocument> _logger;
        private readonly IMapper _mapper;

        public CreateNewDocument(ITransferDocumentRepository documentRepository,
            AppDbContext context, ILogger<CreateNewDocument> logger, IMapper mapper)
        {
            _userRepository = new UserRepository(context, mapper);
            _documentRepository = documentRepository;
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<ExecutionResult> Execute(TransferDocumentRequest request)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (request.Amount <= 0)
                    throw new Exception("transfer amount must be greater than 0");
                if (!await _userRepository.UserExists(request.Recipient))
                    throw new Exception($"the recipient not found");
                if (request.Sender == request.Recipient)
                    throw new Exception("you can’t transfer to yourself");
                // check user balance
                var senderBalance = await _userRepository.GetBalance(request.Sender);
                if (senderBalance < request.Amount)
                    throw new Exception("the transfer amount exceeds the current balance. transfer canceled.");

                //create document
                var creditDoc = new TransferDocumentRequest
                {
                    Amount = request.Amount,
                    Sender = request.Sender,
                    Recipient = request.Recipient,
                    Description = request.Description
                };
                var result = await _documentRepository.CreateDocument(creditDoc, _context);
                await transaction.CommitAsync();
                
                return Success(_mapper.Map<TransferDocumentDto>(result));
            }
            catch (Exception e)
            {
                transaction.Rollback();
                _logger.LogError(e, e.GetBaseException().Message);
                return Failure(new BaseError(e.GetBaseException().Message));
            }
        }
    }
}