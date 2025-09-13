using PropertyChanged;

namespace Yukimi
{
    [AddINotifyPropertyChangedInterface]
    public class MainViewModel
    {
        public object CurrentView { get; set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        public MainViewModel()
        {
            
        }
    }
}
