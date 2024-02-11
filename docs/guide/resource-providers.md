# Resource Providers

Resource providers are used to retrieve Naninovel-related data: ".nani" text files for scenario scripts, textures for character sprites, audio clips for music, etc. Each provider specializes in retrieving the data from a specific source: project's "Resources" folders, Unity's addressable asset system, local file storage, a Google Drive account, etc.

Providers' general behavior can be configured via `Naninovel -> Configuration -> Resource Provider` menu.

![](https://i.gyazo.com/466488bf852f0dd54aa680012b072af1.png)

`Resource Policy` property dictates when the resources are loaded and unloaded during script execution:
 - Static — All the resources required for the script execution are pre-loaded when starting the playback (masked with a loading screen) and unloaded only when the script has finished playing. This policy is default and recommended for most cases.
 - Dynamic — Only the resources required for the next `Dynamic Policy Steps` commands are pre-loaded when starting the playback and all the unused resources are unloaded immediately. Use this mode when targeting platforms with strict memory limitations and it's impossible to properly organize naninovel scripts. Expect hiccups when the resources are loaded in background while the game is progressing.

Find more about how Naninovel loads and loads the resources in the [memory management guide](/guide/resource-providers#memory-management).

When `Log Resources Loading` is enabled, various provider-related log messages will be mirrored to the default loading screen UI.

`Enable Build Processing` enables a build pre-processing procedure required to ensure assets assigned via editor menus are available in the builds. Disabling the processing may be required if you're using a [custom build environment](/guide/custom-build-environment) or attaching your own build hooks. When enabling or disabling the property, restart Unity editor in order for the change to take effect.

When [addressable system](https://docs.unity3d.com/Packages/com.unity.addressables@latest) is installed, enabling `Use Addressables` will optimize asset processing step improving the build time; enabling `Auto Build Bundles` at the same time will cause asset bundles to automatically compile when building the player.

Other properties in the configuration menu are provider-specific and described below.

Resource-specific providers behavior is configured via `Loader` properties, available in the corresponding configuration menus. For example, here is the default loader configuration used to retrieve audio resources (BGM and SFX):

![](https://i.gyazo.com/e9b59f738c93d0cdee6f0999b797a461.png)

`Path Prefix` property allows specifying an additional path over provider's root path for the specific type of resources. Eg, given we're going to retrieve an "Explosion" audio file from a project's "Resources" folder, setting path prefix to "Audio" will result in the following resource request: `Resources.Load("Audio/Explosion")`.

`Providers List` allows specifying which provider types to use and in which order. Eg, in the above example, when requesting an audio resource, first an "Addressable" provider will be used and in case the provider won't be able to find the requested resource, "Project" provider will be used.

Be aware, that **while in editor a special "Editor" resource provider is always used first** (no matter the loaders configuration). The provider has access to all the resources assigned via Naninovel's configuration and resource manager menus (`Naninovel -> Resources -> ...`). When the game is built, all such resources are automatically copied to a temporary "Resources" folder or (when [addressable system](https://docs.unity3d.com/Packages/com.unity.addressables@latest) is installed and enabled) registered in the addressables configuration and compiled to asset bundles. Remember to **always perform any provider-related tests in builds**, not in the Unity editor.

## Addressable

The [Addressable Asset system](https://docs.unity3d.com/Packages/com.unity.addressables@latest) is a Unity package allowing to load assets by "address". It uses asynchronous loading to support loading from any location (local storage, remote web hosting, etc) with any collection of dependencies. Consult Unity's documentation on how to set up, configure and use the system.

Naninovel will automatically use addressables when the package is installed in the project and `Use Addressables` property is enabled in resource provider configuration. No additional setup is required. All the assets assigned in the Naninovel's configuration menus (eg, scenario scripts, character sprites, audio clips, etc) will be registered with the system (assigned an address) when building the player.

::: warning
Due to a [Unity bug](https://github.com/naninovel/docs/issues/159), addressable can't unload individual assets packed into a common bundle; for a temporary workaround, either distribute the assets between bundles or set `Bundle Mode` addressable group settings to `Pack Separately`.

![](https://i.gyazo.com/60a42ec15609d8dbc5258687d9045797.png)
:::

In case you wish to configure how the Naninovel addressable assets are served (eg, specify a remote web host), edit Naninovel groups via `Window -> Asset Management -> Addressables -> Groups` menu. The groups are automatically created when first building the game; in case they're missing, you can create them manually.

![](https://i.gyazo.com/c93fbd9e232ec94468c685c4d6003916.png)

::: info NOTE
Asset records under Naninovel addressable groups are automatically generated on each build. Don't edit the records manually, as any changes will be lost on build.
:::

By default, `Group By Category` option in resource provider configuration is disabled, making all the Naninovel resources be added under a single "Naninovel" addressable group. In case you wish to group the resources by category (eg, to specify individual packing or serving options), enable the property and re-build. When enabled, each resource category (eg, scripts, audio, characters, etc) will be added under their own addressable group named "Naninovel-*Category*", where *Category* is the category of the resource.

![](https://i.gyazo.com/80938ca5ca1021e8a71f783eef516d15.png)

To expose an addressable asset to Naninovel without using editor menus, use a custom addressable group; group can have any name, except it can't start with the reserved "Naninovel" (otherwise, it'll be recognized as an auto-generated and will be cleared on build). Address of the exposed assets should start with "Naninovel/" and they should have a "Naninovel" label assigned. You can specify additional labels to filter the assets used by Naninovel via `Extra Labels` property in resource provider configuration menu.

Addressable provider is only used in runtime builds and is disabled in editor by default. In case you're manually exposing resources via addressable address instead of assigning them with Naninovel's resource managers, you can enable it with `Allow Addressable In Editor` property in resource provider configuration menu.

::: tip EXAMPLE
Check the [example project](https://github.com/naninovel/samples/tree/main/unity/addressable) on how to manually expose Naninovel resources to addressable provider (without using resource editor menus) and serve specific assets from a remote host.

You may also find official Unity learning materials for addressable useful: https://learn.unity.com/course/get-started-with-addressables.
:::

::: info NOTE
We're not providing any tutorials or support for Unity's addressable asset system itself, like setting up a remote web hosting for your assets or other deploy/serving scenarios; consult the [support page](/support/#unity-support) for more information.
:::

## Project

Project provider serves the assets located in "Resources" folders of your Unity project. Consult Unity's guide for more information regarding the project [resources loading API](https://docs.unity3d.com/Manual/LoadingResourcesatRuntime).

Be aware, that in most cases [using "Resources" folders is discouraged](https://docs.unity3d.com/Manual/BestPracticeUnderstandingPerformanceInUnity6). Consider assigning the resource via a Naninovel resource manager menu when possible or use an addressable system instead; don't forget to move the asset out of a "Resources" folder after that.

## Local

Local provider allows serving simple (scenario scripts and managed text, sprite characters and backgrounds, audio) assets from an arbitrary location in the local file system.

::: warning
Local provider loads raw files from the file system and converts them at runtime, which is slow and limits the supported file types compared to other providers. Only use it in development or for specific features (eg, [community modding](/guide/community-modding)).
:::

Supported file formats:

 - `.nani` plain text files for scenario scripts
 - `.png` and `.jpg` for images/textures
 - `.wav` (PCM16 44100Hz stereo only) for audio

::: tip
Add more supported file formats by overriding `IResourceProviderManager` [engine service](/guide/engine-services#overriding-built-in-services) and adding a custom converter for the local provider ([example](https://github.com/naninovel/samples/blob/main/unity/sandbox/Assets/Runtime/WebResourceProvider.cs#L12)).

![](https://i.gyazo.com/d4e63726c2d1d75e2677cab7f2503546.png)
:::

`Local Path Root` property in the resource provider configuration should point to a folder, where the local resources are stored. You can either use an absolute (eg, `C:\Resources`) or a relative path, starting with one of the following origins:

 - `%DATA%` — Game data folder on the target device ([Application.dataPath](https://docs.unity3d.com/ScriptReference/Application-dataPath));
 - `%PDATA%` — Persistent data directory on the target device ([Application.persistentDataPath](https://docs.unity3d.com/ScriptReference/Application-persistentDataPath));
 - `%STREAM%` — "StreamingAssets" folder ([Application.streamingAssetsPath](https://docs.unity3d.com/ScriptReference/Application-streamingAssetsPath));
 - `%SPECIAL{F}%` — An OS special folder, where `F` is the name of a [special folders enum](https://docs.microsoft.com/en-us/dotnet/api/system.environment.specialfolder) value.

Default `%DATA%/Resources` value points to a "Resources" folder inside game's data directory (which is different depending on the target platform).

As one of the usage examples, let's say you want to load naninovel scripts from a `C:/Users/Admin/Dropbox/MyGame/Scripts` folder, which you share with collaborators to author the scenario. While it's possible to just specify an absolute path to the root folder (`C:/Users/Admin/Dropbox/MyGame`), that will require all your collaborators to also store the folder by the exact same path (under the same drive label and user name). Instead, use the following relative path over a "UserProfile" special folder origin: `%SPECIAL{UserProfile}%/Dropbox/MyGame`.

![](https://i.gyazo.com/eb435b782cfb9df6c403702e8f6124df.png)

Given path prefix under the scripts configuration is set to `Scripts` and local provider is added to the list, script navigator (accessible with `nav` [console command](/guide/development-console)) should now pick up any ".nani" text files stored under the folder.

![](https://i.gyazo.com/df8ad31d30b5c10c9a918e69a4543567.png)

## Google Drive

Implemented via an open source (MIT license) third-party package [UnityGoogleDrive](https://github.com/elringus/UnityGoogleDrive) allows using [Google Drive](https://www.google.com/drive) as the provider for the following resources:

* Naninovel scripts and managed text (via Google Documents);
* Characters and backgrounds (sprite implementation only);
* BGM, SFX and voice.

You can share your Google Drive resources folder with other users to work in collaboration without the need to use version control systems or other complicated tools.

In order to be able to choose Google Drive as the resource provider you have to first install [UnityGoogleDrive](https://github.com/elringus/UnityGoogleDrive). Consult the GitHub project readme for installation and setup instructions.

::: info NOTE
Before installing a package from a Git repository, make sure a [Git client](https://git-scm.com/downloads) is installed on your machine and Git executable path is set to the [PATH system environment variable](https://en.wikipedia.org/wiki/PATH_(variable)) (usually performed automatically during the installation).
:::

When UnityGoogleDrive package is installed and configured, related properties will appear in the resource provider configuration menu.

![](https://i.gyazo.com/57281ae3a47e85690d9141179af768a8.png)

`Google Drive Root Path` is a relative path inside your Google Drive's folder to a directory, which should be considered the resources root. Eg, if you want to store the scenario scripts under `MyGame/Scripts`, specify the root as `MyGame`.

With `Google Drive Request Limit` property you can set maximum allowed concurrent requests when contacting Google Drive API. This is required to prevent communication errors when using a personal Google Drive plan, which is limiting the number of allowed concurrent requests.

`Google Drive Cache Policy` dictates caching behavior of the downloaded resources. `Smart` will attempt to use [Changes API](https://developers.google.com/drive/api/v3/reference/changes) to check whether the requested (cached) resource has changed on the remote folder before downloading it. `Purge All On Init` will purge the cache on engine initialization and always use cached versions after the first download. The cache can also be manually purged at any time with `purge` [console command](/guide/development-console).

Don't forget to add Google Drive to the list of providers for the resources you wish to retrieve with it. Eg, following will make the script manager to look for scripts in the Google Drive in addition to addressable and project sources:

![](https://i.gyazo.com/0ad07f73fe12be7ae6d421c5f4f33384.png)

::: tip EXAMPLE
Check [NaninovelSandbox](https://github.com/naninovel/samples/tree/main/unity/sandbox) project for an example on how to set up and use Google Drive provider. In the project, scripts, characters, backgrounds and audio resources are served from corresponding files stored on authorized user drive.
:::

## Custom Providers

It's possible to add a custom implementation of a resource provider and make Naninovel use it with (or instead of) built-in providers.

To add a custom provider, create a C# class with a parameterless constructor and implement `IResourceProvider` interface. Once created, custom provider type will appear in all the loader configuration menus along with the built-in types.

![](https://i.gyazo.com/7176a9d4a4ea2d9414c5495e2e465baf.png)

You can find built-in resource provider implementations at `Naninovel/Runtime/Common/ResourceProvider` package directory; feel free to use them as a reference when implementing your own versions.

Below is an example of a custom provider, that does nothing, but logs messages when used.

```csharp
using Naninovel;
using System;
using System.Collections.Generic;

public class CustomResourceProvider : IResourceProvider
{
    public event Action<float> OnLoadProgress;
    public event Action<string> OnMessage;

    public bool IsLoading => default;
    public float LoadProgress => default;
    public IEnumerable<Resource> LoadedResources => default;

    public Resource<T> GetLoadedResourceOrNull<T> (string path)
        where T : UnityEngine.Object
    {
        OnMessage?.Invoke($"GetLoadedResourceOrNull: {path}");
        return default;
    }

    public UniTask<Resource<T>> LoadResourceAsync<T> (string path)
        where T : UnityEngine.Object
    {
        OnMessage?.Invoke($"LoadResourceAsync: {path}");
        OnLoadProgress?.Invoke(1f);
        return default;
    }

    public UniTask<IEnumerable<Resource<T>>> LoadResourcesAsync<T> (string path)
        where T : UnityEngine.Object
    {
        OnMessage?.Invoke($"LoadResourcesAsync: {path}");
        OnLoadProgress?.Invoke(1f);
        return default;
    }

    public UniTask<IEnumerable<Folder>> LocateFoldersAsync (string path)
    {
        OnMessage?.Invoke($"LocateFoldersAsync: {path}");
        return default;
    }

    public UniTask<IEnumerable<string>> LocateResourcesAsync<T> (string path)
        where T : UnityEngine.Object
    {
        OnMessage?.Invoke($"LocateResourcesAsync: {path}");
        return default;
    }

    public UniTask<bool> ResourceExistsAsync<T> (string path)
        where T : UnityEngine.Object
    {
        OnMessage?.Invoke($"ResourceExistsAsync: {path}");
        return default;
    }

    public bool ResourceLoaded (string path)
    {
        OnMessage?.Invoke($"ResourceLoaded: {path}");
        return default;
    }

    public bool ResourceLoading (string path)
    {
        OnMessage?.Invoke($"ResourceLoading: {path}");
        return default;
    }

    public bool SupportsType<T> ()
        where T : UnityEngine.Object
    {
        OnMessage?.Invoke($"SupportsType: {typeof(T).Name}");
        return default;
    }

    public void UnloadResource (string path)
    {
        OnMessage?.Invoke($"UnloadResource: {path}");
    }

    public void UnloadResources ()
    {
        OnMessage?.Invoke("UnloadResources");
    }
}
```

## Memory Management

Naninovel is independent of Unity scenes, hence the assets (textures, audio, prefabs, etc) are loaded when they're required by the played script and unloaded automatically; specific policy can be selected via `Resource Policy` property in resource provider configuration menu.

Resource provider manager keep track of the references to the loaded resources and dispose (unload) the resources when they're not used ("held") by any users ("holders").

The mechanism is most prominent in script commands. For example, let's assume you want to play a background music with a custom command. The audio player will require an audio clip asset (resource) to play, so we need to preload and "hold" the asset before the command is executed and release it after:

```csharp
public class PlayMusic : Command, Command.IPreloadable
{
    public StringParameter MusicName;

    private IAudioManager audio => Engine.GetService<IAudioManager>();

    public async UniTask PreloadResourcesAsync ()
    {
        await audio.AudioLoader.LoadAndHoldAsync(MusicName, this);
    }

    public void ReleasePreloadedResources ()
    {
        audio.AudioLoader.Release(MusicName, this);
    }

    public override async UniTask ExecuteAsync (AsyncToken asyncToken = default)
    {
        await audio.PlayBgmAsync(MusicName, asyncToken: asyncToken);
    }
}
```

Notice the command implements `Command.IPreloadable` interface. Script player will detect such commands and invoke the preload and unload methods to ensure the assets are ready before the command is executed and released after.

### Sharing Resources

In some cases you may want to share resources between Naninovel and a custom gameplay mode. In case the custom gameplay is implemented independently of Naninovel (the engine is disabled when the custom mode is active), there shouldn't be any issues. However, if both the custom mode and Naninovel are used at the same time, you have to pay attention to how the resources are used.

For example, let's assume you have a Naninovel's sprite background with an appearance texture that is also used as a source for some UI element. At some point Naninovel will attempt to release the texture and it will also disappear in the UI element. That happens, because the engine is not aware, that you're using the texture and it shouldn't be unloaded.

To notify Naninovel, that you're using an asset, use `Hold` method of resource provider service:

```csharp
var resourceManager = Engine.GetService<IResourceProviderManager>();
resourceManager.Hold(asset, holder);
```

Be aware, that while you're holding an asset, it won't be unloaded by Naninovel, so it's up to you to dispose it to prevent memory leaks:

```csharp
var holdersCount = resourceManager.Release(asset, holder);
// In case no one else is holding the asset, we should unload it.
if (holdersCount == 0) Resources.UnloadAsset(asset);
```

"Holder" can be a reference to any object; usually it's the same class that is using the asset. It's used to distinguish the holders and prevent same holder from accidentally holding a resource multiple times.

Below is an example of Unity component, which will prevent Naninovel from ever unloading an asset:

```csharp
using Naninovel;
using UnityEngine;

public class HoldObject : MonoBehaviour
{
    public Object ObjectToHold;

    private async void Start()
    {
        while (!Engine.Initialized) await UniTask.DelayFrame(1);
        Engine.GetService<IResourceProviderManager>().Hold(ObjectToHold, this);
    }
}
```
