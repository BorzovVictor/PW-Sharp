namespace PW.SharedKernel
{
    public class BaseError: Error
    {
        public override int Id { get; } = 400;
        public override string Message { get; }

        public BaseError(int id, string message)
        {
            Id = id;
            Message = message;
        }
        
        public BaseError(string message)
        {
            Message = message;
        }
    }
}