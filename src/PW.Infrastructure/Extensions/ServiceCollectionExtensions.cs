using System;
using System.Reflection;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using PW.Core;
using PW.Infrastructure.Users;

namespace PW.Infrastructure
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddProjectServices(this IServiceCollection services)
        {
            services.AddTransient<IPwSeeder, PwSeeder>();
            
            services.AddRepositories();
            services.AddUsesCases();
            services.AddMapperConfiguration();
            
            services.AddHttpContextAccessor();
            return services;
        }

        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<ITransferDocumentRepository, TransferDocumentRepository>();
            
            return services;
        }

        public static IServiceCollection AddUsesCases(this IServiceCollection services)
        {
            services.AddTransient<IUserLoginCase, UserLogin>();
            services.AddTransient<IUserRegisterCase, UserRegister>();
            services.AddTransient<ISetStartBalanceCase, SetStartBalanceCase>();
            services.AddTransient<IGetFlowOfFundsCase, GetFlowOfFunds>();
            services.AddTransient<IGetTransferDocumentByUserCase, GetTransferDocumentByUser>();
            services.AddTransient<IGetUserTransactionsCase, GetCurrentUserTransactions>();
            services.AddTransient<IGetCurrentUserAmountCase, GetCurrentUserAmount>();
            services.AddTransient<IGetTransactionByIdCase, GetTransactionById>();
            services.AddTransient<ICreateNewDocumentCase, CreateNewDocument>();
            services.AddTransient<IGetUserInfoByIdCase, GetUserInfoById>();
            services.AddTransient<ILoadUsersCase, LoadUsers>();
            services.AddTransient<IGetUserByIdCase, GetUserById>();
            services.AddTransient<IGetTransactionByDocIdCase, GetTransactionByDocId>();

            return services;
        }
        
        public static IServiceCollection AddMapperConfiguration(this IServiceCollection services)
        {
            // http://docs.automapper.org/en/stable/Configuration.html#assembly-scanning-for-auto-configuration
            var infrastructureAssemblyName = Assembly.GetAssembly(typeof(MappingProfile)).GetName().Name;
            var mappingConfig = new MapperConfiguration(
                mc => mc.AddMaps(new[]
                {
                    infrastructureAssemblyName
                })
            );

            try
            {
                mappingConfig.AssertConfigurationIsValid();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }

            IMapper mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);
            return services;
        }
    }
}