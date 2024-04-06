namespace be_project_swp.Core.Dtos.RequestOrder;
public enum StatusRequest
{
    Waiting = 1,
    Processing = 2,
    Completed = 3
}
public class CancelRequest
{
    public bool IsDelete { get; set; } = true;
}

public class UpdateRequest
{
    public bool IsActive { get; set; } = false;
}

public class UpdateStatusRequest
{
    public StatusRequest StatusRequest { get; set; }
}
