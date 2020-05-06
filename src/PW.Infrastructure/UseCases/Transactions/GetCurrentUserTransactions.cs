using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public class GetCurrentUserTransactions : UseCase<IEnumerable<TransactionDto>>, IGetUserTransactionsCase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<GetCurrentUserTransactions> _logger;
        private readonly IHttpContextAccessor _httpContext;

        public GetCurrentUserTransactions(AppDbContext context, ILogger<GetCurrentUserTransactions> logger,
            IHttpContextAccessor httpContext)
        {
            _context = context;
            _logger = logger;
            _httpContext = httpContext;
        }

        public async Task<ExecutionResult> Execute(TransactionRequest request)
        {
            var currUser = _httpContext.HttpContext.User;
            if (currUser.IsNullOrEmpty())
                return Failure(new BaseError("current user not found"));
            try
            {
                int currentUserId = Convert.ToInt32(currUser.Claims.First(c => c.Type == "Id").Value);
                var query = from tr in _context.Transactions
                    join document in _context.TransferDocuments on tr.TransferDocumentId equals document.Id
                    join userSender in _context.Users on document.Sender equals userSender.Id into users from su in users.DefaultIfEmpty()
                    join userRec in _context.Users on document.Recipient equals userRec.Id into usersRec from suRec in usersRec.DefaultIfEmpty()
                    where tr.Corresponded == currentUserId
                    orderby tr.DateTransfer descending 
                    select new TransactionDto
                    {
                        Id = tr.Id,
                        Corresponded = tr.TransactionType == TransactionType.Credit? document.Sender: document.Recipient,
                        CorrespondedName = tr.TransactionType == TransactionType.Credit 
                            ?(document.Sender == -1 ? "System" : su.Name)
                            :suRec.Name,
                        Amount = tr.Amount,
                        Balance = tr.CurrentBalance,
                        DateTransfer = tr.DateTransfer,
                        TransactionType = tr.TransactionType,
                        Descriptions = document.Description,
                        BaseDocumentId = document.Id
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