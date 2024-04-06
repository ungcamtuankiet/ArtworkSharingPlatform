namespace be_project_swp.Core.Constancs
{
    public static class DateTimeExtensions
    {
        public static long GetTimeStamp(this DateTime dateTime)
        {
            return (long)(dateTime.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0)).TotalMicroseconds;
        }
    }
}
