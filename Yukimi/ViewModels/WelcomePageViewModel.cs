using PropertyChanged;
using System.Windows.Input;
using Yukimi.Views;

namespace Yukimi.ViewModels
{
    [AddINotifyPropertyChangedInterface]
    public class WelcomePageViewModel
    {
        public ICommand GoToFeedCommand { get; }

        public WelcomePageViewModel()
        {
            GoToFeedCommand = new RelayCommand(_ =>
            {
                new MainFeed();
            });
        }
    }
}
