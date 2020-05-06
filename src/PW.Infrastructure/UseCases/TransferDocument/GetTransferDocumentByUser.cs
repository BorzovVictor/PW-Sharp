using System;
using System.Collections.Generic;
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
    public class GetTransferDocumentByUser : UseCase<IEnumerable<TransferDocumentDto>>, IGetTransferDocumentByUserCase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<GetTransferDocumentByUser> _logger;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContext;

        public GetTransferDocumentByUser(IMapper mapper, AppDbContext context,
            ILogger<GetTransferDocumentByUser> logger, IHttpContextAccessor httpContext)
        {
            _mapper = mapper;
            _context = context;
            _logger = logger;
            _httpContext = httpContext;
        }

        public async Task<ExecutionResult> Execute(int userId)
        {
            try
            {
                var data = await _context.TransferDocuments
                    .Where(x => x.Recipient == userId || x.Sender == userId)
                    .ToListAsync();
                return Success(_mapper.Map<IEnumerable<TransferDocumentDto>>(data));
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.GetBaseException().Message);
                return Failure(new BaseError(e.GetBaseException().Message));
            }
        }

        public async Task<ExecutionResult> Execute()
        {
            var currUser = _httpContext.HttpContext.User;
            if (currUser.IsNullOrEmpty())
                return Failure(new BaseError("current user not found"));

            try
            {
                int currentUserId = Convert.ToInt32(currUser.Claims.First(c => c.Type == "Id").Value);
                var data = await _context.TransferDocuments
                    .Where(x => x.Recipient == currentUserId || x.Sender == currentUserId)
                    .ToListAsync();
                return Success(_mapper.Map<IEnumerable<TransferDocumentDto>>(data));
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.GetBaseException().Message);
                return Failure(new BaseError(e.GetBaseException().Message));
            }
        }
    }
}