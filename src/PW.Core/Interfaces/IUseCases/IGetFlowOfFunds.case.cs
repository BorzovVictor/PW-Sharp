using System.Collections.Generic;
using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface IGetFlowOfFundsCase
    {
        Task<UseCase<IEnumerable<FlowOfFundsDto>>.ExecutionResult> Execute(FlowOfFundsRequest request);
    }
}