﻿# Special Effects

Special effects are activated via [@spawn] command followed by the effect name. E.g.:

```nani
@spawn ShakeBackground
```
— will shake the main background.

You can control parameters of the effect with `params` parameter. E.g.:

```nani
@spawn ShakeCharacter params:Kohaku,1
```
— will shake character with ID "Kohaku" once, instead of the default 3.

It's possible to selectively specify a subset of the parameters, leaving the rest at the default values:

```nani
@spawn ShakePrinter params:,,0.5
```
— notice the first two parameters (printer ID and shake count) are skipped and will have their default values, but the third parameter (shake duration) is set to 0.5 seconds.

You can update the effect parameters without re-starting it with the consequent [@spawn]  commands, eg:

```nani
; Start slowly shaking `Kohaku` character in a loop, 
; don't wait for completion (it's an infinite loop, anyway)
@spawn ShakeCharacter params:Kohaku,0,,,0.1 wait:false
Kohaku: It's rumbling!
; Shake 3 more times with an increased amplitude
@spawn ShakeCharacter params:Kohaku,3,,,0.8
```

Some effects are persistent by default and should be manually stopped with [@despawn] command. E.g.:

```nani
; Start the rain
@spawn Rain
; Stop the rain
@despawn Rain
```

The [@despawn] commands of some effects can also receive parameters (eg, to control the fade-out duration), eg:

```nani
; Stops the rain gradually over 10 seconds
@despawn Rain params:10
```

When no `params` is specified, default parameters will be used. You can find both "start" (accepted by the [@spawn] command) and "stop" (accepted by the [@despawn] command) parameters available for each effect and their default values in the docs below.

It's possible to start multiple effects of the same type by appending an ID delimited by `#` after the effect name, eg:

```nani
; Shake both `Kohaku` and `Yuko` in a loop
@spawn ShakeCharacter#1 params:Kohaku,0 wait:false
@spawn ShakeCharacter#2 params:Yuko,0 wait:false
```

When stopping or updating instanced effects, don't forget to specify the ID:

```nani
; Stop shaking `Yuko`, increase `Kohaku` amplitude
@despawn ShakeCharacter#2
@spawn ShakeCharacter#1 params:Kohaku,0,,,1
```

You can use any string for ID (it can be a number like above, or something more meaningful, eg `@spawn ShakeCharacter#Kohaku`), just make sure it's unique among other IDs you're using with a given effect name.

## Shake Printer
Shakes printer with the specified ID or the default one.

[!f61fc35e318cce1949b00e5fe2448a80]

**Start Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Printer ID | String | null | ID of the printer to shake. Will shake a default printer when not specified.
Shake count | Integer | 2 | The number of shake iterations. When set to 0, will loop the effect until stopped with [@despawn].
Shake duration | Decimal | 0.15 | The base duration of each shake iteration, in seconds.
Duration variation | Decimal | 0.25 | The randomized delta modifier applied to the base duration of the effect.
Shake amplitude | Decimal | 0.5 | The base displacement amplitude of each shake iteration, in units.
Amplitude variation | Decimal | 0.1 | The randomized delta modifier applied to the base displacement amplitude of the effect.
Shake horizontally | Boolean | false | Whether to displace the actor horizontally (by x-axis).
Shake vertically | Boolean | true | Whether to displace the actor vertically (by y-axis).

Be aware, that when UI is set to "Screen Space Overlay" mode, shake amplitude needs to be about x100 times the default one for a noticeable effect.

**Examples**
```nani
; Shake a default printer with default params
@spawn ShakePrinter

; Shake a default printer horizontally 10 times 
@spawn ShakePrinter params:,10,,,,,true,false

; Start shaking a default printer in loop, print some text, stop the shaking
@spawn ShakePrinter params:,0 wait:false
What a shaky situation!
@despawn ShakePrinter
```

## Shake Background
Shakes background with the specified ID or the main one.

[!fcf1153a0ad3d9a153908206211f5f5f]

**Start Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Background ID | String | null | ID of the background to shake. Will shake main background when not specified.
Shake count | Integer | 3 | The number of shake iterations. When set to 0, will loop the effect until stopped with [@despawn].
Shake duration | Decimal | 0.15 | The base duration of each shake iteration, in seconds.
Duration variation | Decimal | 0.25 | The randomized delta modifier applied to the base duration of the effect.
Shake amplitude | Decimal | 0.5 | The base displacement amplitude of each shake iteration, in units.
Amplitude variation | Decimal | 0.5 | The randomized delta modifier applied to the base displacement amplitude of the effect.
Shake horizontally | Boolean | false | Whether to displace the actor horizontally (by x-axis).
Shake vertically | Boolean | true | Whether to displace the actor vertically (by y-axis).

**Examples**
```nani
; Shake main background with default params
@spawn ShakeBackground

; Shake `Video` background twice 
@spawn ShakeBackground params:Video,2
```

## Shake Character
Shakes character with the specified ID or a random visible one.

[!6001d3cfbee855c8a783d10e4a784042]

**Start Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Character ID | String | null | ID of the character to shake. Will shake a random visible one when not specified.
Shake count | Integer | 3 | The number of shake iterations. When set to 0, will loop the effect until stopped with [@despawn].
Shake duration | Decimal | 0.15 | The base duration of each shake iteration, in seconds.
Duration variation | Decimal | 0.25 | The randomized delta modifier applied to the base duration of the effect.
Shake amplitude | Decimal | 0.5 | The base displacement amplitude of each shake iteration, in units.
Amplitude variation | Decimal | 0.5 | The randomized delta modifier applied to the base displacement amplitude of the effect.
Shake horizontally | Boolean | false | Whether to displace the actor horizontally (by x-axis).
Shake vertically | Boolean | true | Whether to displace the actor vertically (by y-axis).

**Examples**
```nani
; Shake `Kohaku` character with default parameters
@spawn ShakeCharacter params:Kohaku

; Start shaking a random character, show a choice to stop and act accordingly
@spawn ShakeCharacter params:,0 wait:false
@choice "Continue shaking" goto:.Continue
@choice "Stop shaking" goto:.Stop
@stop
# Stop
@despawn ShakeCharacter
# Continue
...
```

## Shake Camera
Shakes the main Naninovel render camera.

[!f9521fbcf959d0b72e449ae6e2191f9f]

**Start Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Camera Name | String | null | Name of the camera object to shake. Will shake the main Naninovel camera when not provided.
Shake count | Integer | 3 | The number of shake iterations. When set to 0, will loop the effect until stopped with [@despawn].
Shake duration | Decimal | 0.15 | The base duration of each shake iteration, in seconds.
Duration variation | Decimal | 0.25 | The randomized delta modifier applied to the base duration of the effect.
Shake amplitude | Decimal | 0.5 | The base displacement amplitude of each shake iteration, in units.
Amplitude variation | Decimal | 0.5 | The randomized delta modifier applied to the base displacement amplitude of the effect.
Shake horizontally | Boolean | false | Whether to displace the actor horizontally (by x-axis).
Shake vertically | Boolean | true | Whether to displace the actor vertically (by y-axis).

**Examples**
```nani
; Shake the main Naninovel camera with default params
@spawn ShakeCamera

; Shake the main Naninovel camera horizontally 5 times 
@spawn ShakeCamera params:,5,,,,,true,false
```

## Animate Actor

In case you wish to change (animate) actor parameters directly, consider using [@animate] command.

[!a0494329c713c4309a52d57d0b297bee]

```nani
; Example from the video above
@animate Yuko appearance:Surprise|Sad|Default|Angry transition:DropFade|Ripple|Pixelate posX:15|85|50 posY:0|-25|-85 scale:1|1.25|1.85 tint:fuchsia|lightblue|white|olive easing:EaseInBounce|EaseInQuad time:3|2|1|0.5
```

## Digital Glitch
Applies a post-processing effect to the main camera simulating digital video distortion and artifacts.

[!94cb6db25c17956473db4de149281df5]

**Start Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Duration | Decimal | 1 | The duration of the effect, in seconds.
Intensity | Decimal | 1 | The intensity of the effect, in 0.0 to 10.0 range.

**Examples**
```nani
; Apply the glitch effect with default parameters
@spawn DigitalGlitch
; Apply the effect over 3.33 seconds with a low intensity
@spawn DigitalGlitch params:3.33,0.1
```

## Rain
Spawns a particle system simulating a rain.

[!74af9eec30f6517ea5b8453a9c86d33c]

**Start Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Intensity | Decimal | 500 | The intensity of the rain (particles spawn rate per second).
Fade-in time | Decimal | 5 | The particle system will gradually grow the spawn rate from 0 to the target level over the specified time, in seconds.
X velocity | Decimal | 1 | Multiplier to the horizontal speed of the particles. Use to change angle of the rain drops.
Y velocity | Decimal | 1 | Multiplier to the vertical speed of the particles.

**Stop Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Fade-out time | Decimal | 5 | The particle system will gradually lower the spawn rate from the target level to 0 over the specified time, in seconds.

**Examples**
```nani
; Start intensive rain over 10 seconds
@spawn Rain params:1500,10
; Stop the rain over 30 seconds
@despawn Rain params:30
```

## Snow
Spawns a particle system simulating a snow.

[!25a052444c561e40c8318272f51edf47]

**Start Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Intensity | Decimal | 100 | The intensity of the snow (particles spawn rate per second).
Fade-in time | Decimal | 5 | The particle system will gradually grow the spawn rate from 0 to the target level over the specified time, in seconds.

**Stop Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Fade-out time | Decimal | 5 | The particle system will gradually lower the spawn rate from the target level to 0 over the specified time, in seconds.

**Examples**
```nani
; Start intensive snow over 10 seconds
@spawn Snow params:300,10
; Stop the snow over 30 seconds
@despawn Snow params:30
```

## Sun Shafts
Spawns a particle system simulating sun shafts (rays).

[!7edc4777699229abc508f2bdb404522e]

**Start Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Intensity | Decimal | 0.85 | The intensity of the rays (opacity).
Fade-in time | Decimal | 3 | The particle system will gradually grow the intensity from 0 to the target level over the specified time, in seconds.

**Stop Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Fade-out time | Decimal | 3 | The particle system will gradually lower the opacity from the target level to 0 over the specified time, in seconds.

**Examples**
```nani
; Start intensive sunshine over 10 seconds
@spawn SunShafts params:1,10
; Stop the sunshine over 30 seconds
@despawn SunShafts params:30
```

## Depth of Field (Bokeh)
Simulates depth of field (aka DOF, bokeh) effect, when only the object in focus stays sharp, while the other image is blurred.

::: tip
In case you want to blur just one object (actor), consider using [Blur effect](/guide/special-effects.md#blur) instead.
:::

[!616a023c46f207b4a3a33d3d3fd9fbc9]

**Start Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Focus Object Name | String | null | Name of the game object to set focus for (optional). When set, the focus will always stay on the game object and `Focus Distance` parameter will be ignored.
Focus Distance | Decimal | 10 | Distance from the Naninovel camera to the focus point. Ignored when `Focus Object Name` is specified.
Focal Length | Decimal | 3.75 | Amount of blur to apply for the de-focused areas; also determines focus sensitivity.
Duration | Decimal | 1 | Interpolation time (how fast the parameters will reach the target values).

**Stop Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Stop Duration | Decimal | 1 | Fade-off (disable) duration for the effect parameters to reach default values where the effect is not visible.

**Examples**
```nani
; Enable the effect with default parameters and lock focus to `Kohaku` game object
@spawn DepthOfField params:Kohaku
; Fade-off (disable) the effect over 10 seconds
@despawn DepthOfField params:10
; Set focus point 10 units away from the camera,
; focal distance to 0.95 and apply it over 3 seconds
@spawn DepthOfField params:,10,0.95,3
```

## Blur
Applies a blur filter to a supported actor: backgrounds and characters of sprite, layered, diced, Live2D, Spine, video and scene implementations. By default (when first parameter is not specified), the effect is applied to `MainBackground` actor.

[!067614d77783683e74ca79652099b58d]

**Start Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Actor ID | String | MainBackground | ID of the actor to apply the effect for. The actor should have `IBlurable` interface implemented in order to support the effect.
Intensity | Decimal | 0.5 | Intensity of the effect, in 0.0 to 1.0 range.
Duration | Decimal | 1 | Interpolation time, in seconds (how fast the intensity will reach the target value).

**Stop Parameters**
Name | Type | Default | Description
--- | --- | --- | ---
Stop Duration | Decimal | 1 | Fade-off (disable) duration for the effect, in seconds.

**Examples**
```nani
; Apply the blur to the current main background
@spawn Blur
; Apply the blur to `Sky` background with full intensity over 2.5 seconds
@spawn Blur params:Sky,1,2.5
; Fade-off and disable the blur
@despawn Blur
```

## Adding Custom Effects

### Standalone Effects

You can add a custom standalone effect (implemented via a prefab, like the "Rain" and "Snow" built-in effects) by adding the effect prefab via spawn resources manager (`Naninovel -> Resources -> Spawn`) and using [@spawn] and [@despawn] commands in the same way as with the built-in effects.

![](https://i.gyazo.com/45b9d8fb51ffb368ff9f792221f10ca6.png)

For example, given there is a `Explosion.prefab` prefab assigned via the spawn manager, following commands will spawn and de-spawn (destroy) the prefab on scene:

```nani
@spawn Explosion
@despawn Explosion
```

The command supports transform parameters, allowing to spawn the object at a specific scene or world positions and with a specific rotation or scale, eg:

```nani
; Spawn Explosion 15% from the left border of the screen
; with x10 scale and rotated by 15 degrees over z-axis.
@spawn Explosion pos:15 scale:10 rotation:,,15
```

In case you have a lot of prefabs to spawn and it's inconvenient to assign them via editor menu, it's possible to just drop them at `Resources/Naninovel/Spawn` folder and they'll automatically be available in the scripts. You can additionally organize them with sub-folders, if you wish; in this case use forward slashes (`/`) when referencing them in naninovel scripts. Eg, prefab asset stored as `Resources/Naninovel/Spawn/Explosions/Boom01` can be referenced in scripts as `Explosions/Boom01`.

It's also possible to use [addressable asset system](/guide/resource-providers.md#addressable) to manually expose the resources. To expose an asset, assign address equal to the path you'd use to expose it via the method described above, except omit the "Resources/" part. Eg, to expose a "Boom01" prefab asset, assign the asset following address: `Naninovel/Spawn/Boom01`. Be aware, that addressable provider is not used in editor by default; you can allow it by enabling `Enable Addressable In Editor` property in resource provider configuration menu.

Check the built-in effect prefabs stored at `Naninovel/Prefabs/FX` for reference implementations.

### Camera Effects

If you wish to apply a custom [post-processing effect](https://assetstore.unity.com/?q=post%20processing&orderBy=1) (aka image effect or camera filter, like the "Digital Glitch" built-in effect) to the Naninovel camera, [create a camera prefab](https://docs.unity3d.com/Manual/CreatingPrefabs.html), [add the required effect components](https://docs.unity3d.com/Manual/UsingComponents.html) to the camera's object and assign the prefab to `Custom Camera Prefab` field in the camera configuration menu (`Naninovel -> Configuration -> Camera`).

![](https://i.gyazo.com/6024aac1d2665dd96915758cd5c09fde.png)

You can toggle (enable if disabled and vice-versa) the added components via naninovel scripts using `toggle` parameter and explicitly set the enabled state with `set` parameter of the [@camera] command. For example, let's assume you've added a "Bloom Image Effect" component to the camera object. First, find out what is the type name of the component; it's usually specified in the `Script` field of the component.

![](https://i.gyazo.com/73b7eabfe97ed84796cbe715b7dafc14.png)

In our case the component's type name is `BloomImageEffect`. Use the type name to toggle this component at runtime like follows:

```nani
@camera toggle:BloomImageEffect
```

You can toggle multiple components at once by delimiting the type names with commas:

```nani
@camera toggle:BloomImageEffect,Sepia,CameraNoise
```

And in case you want to explicitly enable or disable a component:

```nani
@camera set:BloomImageEffect.true,Sepia.false,CameraNoise.true
```

— will enabled `BloomImageEffect` and `CameraNoise` components, while disabling `Sepia`.

To toggle, disable or enable all the components attached to the camera object, use `*` symbol.

```nani
; Toggle all components
@camera toggle:*

; Disable all components
@camera set:*.false

; Enable all components
@camera set:*.true
```

The state of the currently enabled (and disabled) camera components will be automatically saved and restored on game save-loading operations.

Check out the following video for example on adding a custom camera filter effect.

[!!IbT6MTecO-k]