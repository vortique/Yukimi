using System.Windows.Input;

namespace Yukimi
{
    public class RelayCommand : ICommand
    {
        #region Action Properties

        private readonly Action<object?> _execute;
        private readonly Func<object?, bool>? _canExecute;

        #endregion

        #region Constructor

        public RelayCommand(Action<object?> execute, Func<object?, bool>? canExecute = null)
        {
            _execute = execute;
            _canExecute = canExecute;
        }

        #endregion

        #region Events

        public event EventHandler? CanExecuteChanged;

        #endregion

        #region Methods

        public bool CanExecute(object? parameter) => _canExecute?.Invoke(parameter) ?? true;

        public void Execute(object? parameter) => _execute(parameter);

        #endregion
    }
}