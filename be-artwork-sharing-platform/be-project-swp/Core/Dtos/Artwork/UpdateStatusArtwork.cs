namespace be_project_swp.Core.Dtos.Artwork;

public class AcceptArtwork
{
    public bool IsActive { get; set; } = true;
}

public class RefuseArtwork
{
    public string Reason { get; set; } = "No Accept By Admin";
}

