namespace PW.Core
{
    public class UserFilter: BaseFilter
    {
        public UserFilter()
        {
            ExceptSelf = true;
        }
        /// <summary>
        /// filter by UserName field
        /// </summary>
        public string SearchValue { get; set; }
        /// <summary>
        /// Exclude self acc
        /// </summary>
        public bool ExceptSelf { get; set; }
        public bool IsEmpty()
        {
            return !Skip.HasValue && 
                   !Take.HasValue && 
                   string.IsNullOrEmpty(SearchValue) &&
                   !ExceptSelf;
        }
    }
}