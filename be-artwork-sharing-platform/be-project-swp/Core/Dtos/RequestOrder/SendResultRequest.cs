using System.ComponentModel.DataAnnotations;

namespace be_project_swp.Core.Dtos.RequestOrder
{
    public class SendResultRequest
    {
        [Required]
        public string Url_Image { get; set; }
        public string Text { get; set; }
        [Required]
        [Range(1, Double.MaxValue, ErrorMessage = "Price must be more than 0")]
        public double Price { get; set; }
    }
}
