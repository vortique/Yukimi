using System.IO;
using Yukimi.ViewModels;

namespace Yukimi
{
    public static class UserService
    {
        public static string UserProfileFilePath { get; } =
            Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Yukimi", "UserPofile", "UserProfile.json");

        public static UserProfileModel.Root LoadUserProfile()
        {
            if (!File.Exists(UserProfileFilePath))
            {
                CreateUserProfile();
            }

            var userProfile = JSONHelper.DeserializeFromFile<UserProfileModel.Root>(UserProfileFilePath);

            return userProfile;
        }

        public static void SaveUserProfile(UserProfileModel.Root userProfile)
        {
            if (!File.Exists(UserProfileFilePath))
            {
                CreateUserProfile();
            }

            JSONHelper.SerializeJSONAndSaveToFile(userProfile, UserProfileFilePath, true);
        }

        public static void CreateUserProfile()
        {
            string exampleUserProfileJSONPath = Path.Combine(AppContext.BaseDirectory, "Models/StorageModels/ExampleUserProfile.json");

            var exampleUserProfileDeserialized = JSONHelper.
                    DeserializeFromFile<UserProfileModel.Root>(exampleUserProfileJSONPath);

            exampleUserProfileDeserialized.user.username = Environment.UserName;

            string directory = Path.GetDirectoryName(UserProfileFilePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            JSONHelper.SerializeJSONAndSaveToFile(exampleUserProfileDeserialized, UserProfileFilePath, true);
        }
    }
}
