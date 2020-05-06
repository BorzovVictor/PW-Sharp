using AutoMapper;
using PW.Core;
using PW.Core.Entities;

namespace PW.Infrastructure
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserDto, User>()
                .ForMember(d => d.FirstName, opt => opt.Ignore())
                .ForMember(d => d.LastName, opt => opt.Ignore())
                .ForMember(d => d.Password, opt => opt.Ignore())
                // .ForSourceMember(s=> s.Token, opt=> opt.DoNotValidate())
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.UserName))
                .ReverseMap();
            
            CreateMap<UserInfoDto, User>()
                .ForMember(d => d.FirstName, opt => opt.Ignore())
                .ForMember(d => d.LastName, opt => opt.Ignore())
                .ForMember(d => d.Password, opt => opt.Ignore())
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.UserName))
                .ReverseMap();

            CreateMap<PwUser, User>()
                .ForMember(d => d.FirstName, opt => opt.Ignore())
                .ForMember(d => d.LastName, opt => opt.Ignore())
                .ForMember(d => d.Password, opt => opt.Ignore())
                .ForMember(d => d.Email, opt => opt.Ignore())
                .ForMember(d => d.CurrentBalance, opt => opt.Ignore())
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.UserName))
                .ReverseMap();
            
            CreateMap<TransferDocumentRequest, TransferDocument>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.DateTransfer, opt => opt.Ignore())
                .ReverseMap();

            CreateMap<TransferDocumentDto, TransferDocument>()
                .ReverseMap();
        }
    }
}