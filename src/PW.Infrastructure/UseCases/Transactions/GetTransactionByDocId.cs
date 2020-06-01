using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public class GetTransactionByDocId : UseCase<TransactionDto>, IGetTransactionByDocIdCase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<GetTransactionById> _logger;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContext;

        public GetTransactionByDocId(AppDbContext context, ILogger<GetTransactionById> logger, IMapper mapper,
            IHttpContextAccessor httpContext)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
            _httpContext = httpContext;
        }

        public async Task<ExecutionResult> Execute(long docId)
        {
            if (docId <= 0)
                return Failure(new BaseError("document Id should be greater than 0"));

            var currUser = _httpContext.HttpContext.User;
            if (currUser.IsNullOrEmpty())
                return Failure(new BaseError("current user not found"));

            try
            {
                int currentUserId = Convert.ToInt32(currUser.Claims.First(c => c.Type == "Id").Value);
                
                var query = from tr in _context.Transactions
                    join document in _context.TransferDocuments on tr.TransferDocumentId equals document.Id
                    join userSender in _context.Users on document.Sender equals userSender.Id into users
                    from su in users.DefaultIfEmpty()
                    join userRec in _context.Users on document.Recipient equals userRec.Id into usersRec
                    from suRec in usersRec.DefaultIfEmpty()
                    where document.Id == docId && tr.Corresponded == currentUserId
                    orderby tr.DateTransfer descending
                    select new TransactionDto
                    {
                        Id = tr.Id,
                        Corresponded = tr.TransactionType == TransactionType.Credit
                            ? document.Sender
                            : document.Recipient,
                        CorrespondedName = tr.TransactionType == TransactionType.Credit
                            ? (document.Sender == -1 ? "System" : su.Name)
                            : suRec.Name,
                        Amount = tr.Amount,
                        Balance = tr.CurrentBalance,
                        DateTransfer = tr.DateTransfer,
                        TransactionType = tr.TransactionType,
                        Descriptions = document.Description,
                        BaseDocumentId = document.Id
                    };

                var founded = await query.FirstOrDefaultAsync();
                if (founded == null)
                    throw new Exception($"record by id: {docId} not found");

                return Success(founded);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.GetBaseException().Message);
                return Failure(new BaseError(e.GetBaseException().Message));
            }
        }
    }
}