using be_artwork_sharing_platform.Core.Constancs;
using Microsoft.AspNetCore.Identity;

namespace be_project_swp.Core.Dtos.Auth
{
    public class RoleSeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleSeeder(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task SeedRolesAsync()
        {
            bool isAdminRoleExists = await _roleManager.RoleExistsAsync(StaticUserRole.ADMIN);
            bool isCreatorRoleExists = await _roleManager.RoleExistsAsync(StaticUserRole.CREATOR);

            if (isAdminRoleExists && isCreatorRoleExists)
                return;

            await _roleManager.CreateAsync(new IdentityRole(StaticUserRole.ADMIN));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRole.CREATOR));
        }
    }
}
