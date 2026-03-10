namespace Domain.Exceptions
{
    public class UnauthorizedException : Exception
    {
        public string ErrorCode { get; private set; } = string.Empty;

        public UnauthorizedException()
            : base()
        {
        }

        public UnauthorizedException(string message, string errorCode = "")
            : base(message)
        {
            ErrorCode = errorCode;
        }

        public UnauthorizedException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
