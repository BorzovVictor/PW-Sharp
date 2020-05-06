using System.Threading.Tasks;

namespace PW.SharedKernel
{
    public interface IDomainEventDispatcher
    {
        Task Dispatch(BaseDomainEvent domainEvent);
    }
}