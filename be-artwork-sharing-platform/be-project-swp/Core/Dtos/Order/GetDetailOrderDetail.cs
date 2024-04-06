namespace be_project_swp.Core.Dtos.Order;
public class GetResultAfterRequestPayment
{
    public double Price { get; set; }
    public string NickName_Receivier { get; set; }
    public DateTime Date_Purchased { get; set; }
    public string Text_Result { get; set; }
    public string Url_Image { get; set; }
}


