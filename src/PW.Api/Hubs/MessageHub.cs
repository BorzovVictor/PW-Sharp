using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace PW.Api.Hubs
{
    [Authorize]
    public class MessageHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            //            string name = Context.User.Identity.Name;
            //            var user =  _userService.GetCurrentUser(Context.User).Result;
            //            Groups.AddToGroupAsync(Context.ConnectionId, Context.UserIdentifier);
            return base.OnConnectedAsync();
        }
    }
}