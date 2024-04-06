using System.ComponentModel.DataAnnotations.Schema;

namespace be_artwork_sharing_platform.Core.Dtos.Artwork;

public class ArtworkDto
{
    public long Id { get; set; }
    public string User_Id { get; set; }
    public string Category_Name { get; set; }
    public string Nick_Name { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Url_Image { get; set; }
    public double Price { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public string Owner { get; set; }
    public bool IsPayment { get; set; }
}

public class GetArtworkByUserId
{
    public long Id { get; set; }
    public string User_Id { get; set; }
    public string Category_Name { get; set; }
    public string Nick_Name { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Url_Image { get; set; }
    public double Price { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public string ReasonRefuse { get; set; } = "Processing";
    public string Owner { get; set; }
    public bool IsPayment { get; set; }
}

