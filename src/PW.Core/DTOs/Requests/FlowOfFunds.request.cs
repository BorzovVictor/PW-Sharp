namespace PW.Core
{
    public class FlowOfFundsRequest: BaseFilter
    {
        public int? UserId { get; set; }
        public bool IsEmpty()
        {
            return !UserId.HasValue;
        }
    }
}