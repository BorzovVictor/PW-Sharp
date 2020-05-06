using System;
using System.Threading.Tasks;
using AutoMapper;
using PW.Core;
using PW.Core.Entities;

namespace PW.Infrastructure
{
    public class TransferDocumentRepository : ITransferDocumentRepository
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public TransferDocumentRepository(IMapper mapper, IUserRepository userRepository)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }

        public async Task CreateDocuments(TransferDocumentRequest request, AppDbContext context)
        {
            if (request.Amount <= 0)
                throw new Exception("transfer amount must be greater than zero");
            if (!await _userRepository.UserExists(request.Recipient))
                throw new Exception($"user not found by id {request.Recipient}");

            var createdDoc = _mapper.Map<TransferDocument>(request);
            createdDoc.DateTransfer = DateTime.Now;
            await context.TransferDocuments.AddAsync(createdDoc);
            await context.SaveChangesAsync();

            decimal currBalanceDebit = 0;
            // debit transaction
            var trDebit = new Transaction
            {
                DateTransfer = createdDoc.DateTransfer,
                Corresponded = createdDoc.Sender,
                Amount = createdDoc.Amount * -1,
                TransactionType = TransactionType.Debit,
                TransferDocumentId = createdDoc.Id,
                CurrentBalance = currBalanceDebit
            };

            if (request.Sender > 0)
            {
                currBalanceDebit = await _userRepository.GetBalance(request.Sender) - createdDoc.Amount;
                await context.Transactions.AddAsync(trDebit);
                // _context.SaveChanges();
            }

            //credit transaction
            var balance = await _userRepository.GetBalance(request.Recipient);
            var currBalanceCredit = balance + createdDoc.Amount;
            Transaction trCredit = new Transaction
            {
                DateTransfer = createdDoc.DateTransfer,
                Corresponded = createdDoc.Recipient,
                Amount = createdDoc.Amount,
                TransactionType = TransactionType.Credit,
                TransferDocumentId = createdDoc.Id,
                CurrentBalance = currBalanceCredit
            };
            await context.Transactions.AddAsync(trCredit);
            await context.SaveChangesAsync();

            await _userRepository.UpdateCurrentBalance(request.Recipient, currBalanceCredit, context, true);
            if (request.Sender > 0)
                await _userRepository.UpdateCurrentBalance(request.Sender, currBalanceDebit, context, true);
        }
        
        public async Task<TransferDocument> CreateDocument(TransferDocumentRequest request, AppDbContext context)
        {
            if (request.Amount <= 0)
                throw new Exception("transfer amount must be greater than zero");
            if (!await _userRepository.UserExists(request.Recipient))
                throw new Exception($"user not found by id {request.Recipient}");

            var createdDoc = _mapper.Map<TransferDocument>(request);
            createdDoc.DateTransfer = DateTime.Now;
            await context.TransferDocuments.AddAsync(createdDoc);
            await context.SaveChangesAsync();

            decimal currBalanceDebit = 0;
            // debit transaction
            var trDebit = new Transaction
            {
                DateTransfer = createdDoc.DateTransfer,
                Corresponded = createdDoc.Sender,
                Amount = createdDoc.Amount * -1,
                TransactionType = TransactionType.Debit,
                TransferDocumentId = createdDoc.Id,
                CurrentBalance = currBalanceDebit
            };

            if (request.Sender > 0)
            {
                trDebit.CurrentBalance = await _userRepository.GetBalance(request.Sender) - createdDoc.Amount;
                currBalanceDebit = trDebit.CurrentBalance;
                await context.Transactions.AddAsync(trDebit);
                // _context.SaveChanges();
            }

            //credit transaction
            var balance = await _userRepository.GetBalance(request.Recipient);
            var currBalanceCredit = balance + createdDoc.Amount;
            Transaction trCredit = new Transaction
            {
                DateTransfer = createdDoc.DateTransfer,
                Corresponded = createdDoc.Recipient,
                Amount = createdDoc.Amount,
                TransactionType = TransactionType.Credit,
                TransferDocumentId = createdDoc.Id,
                CurrentBalance = currBalanceCredit
            };
            await context.Transactions.AddAsync(trCredit);
            await context.SaveChangesAsync();

            await _userRepository.UpdateCurrentBalance(request.Recipient, currBalanceCredit, context, true);
            if (request.Sender > 0)
                await _userRepository.UpdateCurrentBalance(request.Sender, currBalanceDebit, context, true);
            return createdDoc;
        }
    }
}