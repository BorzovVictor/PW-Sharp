using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PW.Core;

namespace PW.Api.Controllers
{
    [Authorize]
    [Route("api/documents/[controller]")]
    public class TransactionsController : BaseApiController
    {
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TransactionDto>), 200)]
        [ProducesResponseType(400)]
        [Produces("application/json")]
        public async Task<IActionResult> Get(
            [FromServices] IGetUserTransactionsCase service,
            [FromQuery] TransactionRequest filter
        )
        {
            try
            {
                var result = await service.Execute(filter);
                return result.Succeded
                    ? (IActionResult) Ok(result.Success)
                    : BadRequest(result.Failure);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TransactionDto), 200)]
        [ProducesResponseType(400)]
        [Produces("application/json")]
        public async Task<IActionResult> GetById([FromServices] IGetTransactionByIdCase service, long id)
        {
            try
            {
                var result = await service.Execute(id);
                return result.Succeded
                    ? (IActionResult) Ok(result.Success)
                    : BadRequest(result.Failure);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }
    }
}