using System;
using System.Globalization;

// ReSharper disable once CheckNamespace
namespace PW.SharedKernel
{
    public static class CommonExtensions
    {
        public static bool IsNullOrEmpty<T>(this T value)
        {
            if (typeof(T) == typeof(string)) return string.IsNullOrWhiteSpace(value as string);

            return value == null || value.Equals(default(T));
        }

        public static DateTime ToDateTimeOrNow(this string value, string format = "yyyy-MM-d HH:mm:ss")
        {
            if (value.IsNullOrEmpty())
                return DateTime.Now;
            if (value.ToUpper() == "NOW")
                return DateTime.Now;
            return DateTime.TryParseExact(value, format, null, DateTimeStyles.None, out var result)
                ? result
                : DateTime.Now;
        }

        public static DateTime ToDateTime(this string value, string format = "yyyy-MM-d HH:mm:ss")
        {
            if (value.ToUpper() == "NOW")
                return DateTime.Now;
            return DateTime.ParseExact(value, format, null);
        }

        /// <summary>
        /// method returns dateTime object converted from string or null
        /// </summary>
        /// <param name="value">string value of dateTime</param>
        /// <param name="format">date time format to try parse. default value: yyyy-MM-d HH:mm:ss</param>
        /// <returns></returns>
        public static DateTime? ToDateTimeSafely(this string value, string format = "yyyy-MM-d HH:mm:ss")
        {
            if (value.IsNullOrEmpty())
                return null;
            if (value.ToUpper() == "NOW")
                return DateTime.Now;
            if (DateTime.TryParseExact(value, format, null, DateTimeStyles.None, out var result))
                return result;
            return null;
        }
    }
}