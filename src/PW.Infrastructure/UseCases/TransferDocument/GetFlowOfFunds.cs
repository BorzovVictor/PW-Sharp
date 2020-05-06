using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public class GetFlowOfFunds: UseCase<IEnumerable<FlowOfFundsDto>>, IGetFlowOfFundsCase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<GetFlowOfFunds> _logger;

        public GetFlowOfFunds(AppDbContext context, ILogger<GetFlowOfFunds> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ExecutionResult> Execute(FlowOfFundsRequest request)
        {
            if (request.IsEmpty())
                return Failure(new BaseError("query filter is empty"));
            try
            {
                var query = from td in _context.TransferDocuments
                    join tr in _context.Transactions on td.Id equals tr.TransferDocumentId
                    join userSender in _context.Users on td.Sender equals userSender.Id into users
                    from su in users.DefaultIfEmpty()
                    join userRec in _context.Users on td.Recipient equals userRec.Id into usersRec
                    from suRec in usersRec.DefaultIfEmpty()
                    where td.Recipient == request.UserId || td.Sender == request.UserId
                        && ((tr.Corresponded == td.Sender  && tr.TransactionType == TransactionType.Debit) 
                            || (tr.Corresponded == td.Recipient  && tr.TransactionType == TransactionType.Credit))
                    orderby td.DateTransfer descending
                    select new FlowOfFundsDto
                    {
                        Id = td.Id,
                        Sender = td.Sender,
                        SenderName = su.Name,
                        Recipient = td.Recipient,
                        RecipientName = suRec.Name,
                        Amount = tr.Amount,
                        DateTransfer = td.DateTransfer,
                        Description = td.Description,
                        Balance = tr.CurrentBalance
                    };
                var result = await query
                    .Skip(request.Skip.Value)
                    .Take(request.Take.Value)
                    .ToListAsync();
                
                return Success(result);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.GetBaseException().Message);
                return Failure(new BaseError(e.GetBaseException().Message));
            }
        }
    }
}