using System.Threading.Tasks;

namespace PW.SharedKernel
{
    public interface IHandle<in T> where T : BaseDomainEvent
    {
        Task Handle(T domainEvent);
    }
}