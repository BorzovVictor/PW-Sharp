using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public class SetStartBalanceCase : UseCase<bool>, ISetStartBalanceCase
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<SetStartBalanceCase> _logger;
        private readonly ITransferDocumentRepository _documentRepository;

        public SetStartBalanceCase(IMapper mapper, AppDbContext context, ILogger<SetStartBalanceCase> logger,
            ITransferDocumentRepository documentRepository)
        {
            _mapper = mapper;
            _context = context;
            _logger = logger;
            _documentRepository = documentRepository;
            _userRepository = new UserRepository(_context, mapper);
        }

        public async Task<ExecutionResult> Execute(int userId, decimal amount)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var creditDoc = new TransferDocumentRequest
                {
                    Amount = amount,
                    Sender = -1,
                    Recipient = userId,
                    Description = "starting reward [System]"
                };

                await _documentRepository.CreateDocuments(creditDoc, _context);
                transaction.Commit();
                
                return Success(true);
            }
            catch (Exception e)
            {
                transaction.Rollback();
                _logger.LogError(e, e.GetBaseException().Message);
                return Failure(new BaseError(e.GetBaseException().Message));
            }
        }

        // private async Task CreateDocuments(TransferDocumentRequest request)
        // {
        //     await using var transaction = await _context.Database.BeginTransactionAsync();
        //     try
        //     {
        //         var createdDoc = _mapper.Map<TransferDocument>(request);
        //         createdDoc.DateTransfer = DateTime.Now;
        //         _context.TransferDocuments.Add(createdDoc);
        //         _context.SaveChanges();
        //
        //         decimal currBalanceDebit = 0;
        //         // debit transaction
        //         var trDebit = new Transaction
        //         {
        //             DateTransfer = createdDoc.DateTransfer,
        //             Corresponded = createdDoc.Sender,
        //             Amount = createdDoc.Amount * -1,
        //             TransactionType = TransactionType.Debit,
        //             TransferDocumentId = createdDoc.Id,
        //             CurrentBalance = currBalanceDebit
        //         };
        //
        //         if (request.Sender > 0)
        //         {
        //             currBalanceDebit = await _userRepository.GetBalance(request.Sender) - createdDoc.Amount;
        //             _context.Transactions.Add(trDebit);
        //             // _context.SaveChanges();
        //         }
        //
        //         //credit transaction
        //         var balance = await _userRepository.GetBalance(request.Recipient);
        //         var currBalanceCredit = balance + createdDoc.Amount;
        //         Transaction trCredit = new Transaction
        //         {
        //             DateTransfer = createdDoc.DateTransfer,
        //             Corresponded = createdDoc.Recipient,
        //             Amount = createdDoc.Amount,
        //             TransactionType = TransactionType.Credit,
        //             TransferDocumentId = createdDoc.Id,
        //             CurrentBalance = currBalanceCredit
        //         };
        //         _context.Transactions.Add(trCredit);
        //         _context.SaveChanges();
        //
        //         await _userRepository.UpdateCurrentBalance(request.Recipient, currBalanceCredit, _context, true);
        //         if (request.Sender > 0)
        //             await _userRepository.UpdateCurrentBalance(request.Sender, currBalanceDebit, _context, true);
        //
        //         transaction.Commit();
        //     }
        //     catch (Exception)
        //     {
        //         transaction.Rollback();
        //         throw;
        //     }
        // }
    }
}