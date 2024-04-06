namespace be_artwork_sharing_platform.Core.Entities
{
    public class Log : BaseEntity<long>
    {
        public string? UserName { get; set; }
        public string Description { get; set; }
    }
}
