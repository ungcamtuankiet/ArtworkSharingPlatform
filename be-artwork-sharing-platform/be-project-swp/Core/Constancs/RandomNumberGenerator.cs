namespace be_project_swp.Core.Constancs
{
    public static class RandomNumberGenerator
    {
        public static readonly Random _random = new Random();
        public static int Generate(int min, int max)
        {
            return _random.Next(min, max);
        }
    }
}
