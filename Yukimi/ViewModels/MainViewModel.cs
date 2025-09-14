using PropertyChanged;
using System.Windows.Input;
using Yukimi.Views;

namespace Yukimi.ViewModels
{
    [AddINotifyPropertyChangedInterface]
    public class MainViewModel
    {
        #region Commands

        public ICommand LoadedCommand { get; }

        public ICommand ExitCommand { get; }

        #endregion

        public UserProfileModel.Root UserProfile { get; set; }

        public object CurrentView { get; set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        public MainViewModel()
        {
            CurrentView = null;

            UserProfile = UserService.LoadUserProfile();

            LoadedCommand = new RelayCommand(OnLoaded, _ => true);
            ExitCommand = new RelayCommand(OnExit, _ => true);
        }

        #region OnLoadedAction

        private void OnLoaded(object? obj)
        {
            if (UserProfile.user.new_user)
            {
                CurrentView = new WelcomePage();

                UserProfile.user.new_user = false;

                UserService.SaveUserProfile(UserProfile);
            }
            else
            {
                CurrentView = new MainFeed();
            }
        }

        #endregion

        #region ExitCommand

        private void OnExit(object? obj)
        {
            UserService.SaveUserProfile(UserProfile);
        }

        #endregion
    }
}