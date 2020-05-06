namespace PW.Core
{
    public class BaseFilter
    {
        public virtual int? Skip { get; set; } = 0;
        public virtual int? Take { get; set; } = 10;
    }
}