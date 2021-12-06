# Render Pipelines

It's possible to use Unity's [scriptable render pipelines](https://docs.unity3d.com/Manual/render-pipelines.html) (SRP) — both URP and HDRP — with Naninovel, but it will require additional setup and some features may not work out of the box (see limitations below).

::: note
The SRPs are still [hardly production-ready](https://forum.unity.com/threads/915275) and lack features compared to default rendering system. It's **not recommended to use the render pipelines**, unless you're an advanced user and ready to solve potential issues and limitations yourself. 
:::

::: warn
**We won't be able to provide any support or guidance** for the engine features that are not working with the SRPs out of the box. If you choose to use render pipelines, expect that some features may not work as expected or not work at all, and we won't be able to provide any support for such cases.
:::

## Setup

See the [official documentation](https://docs.unity3d.com/Manual/render-pipelines.html) on how to install and configure your SRP of choice.

If you're using URP, no Naninovel-specific configuration is required for basic setup.

HDRP doesn't support camera stacking, so it's required to disable `Use UI Camera` in the camera configuration menu (enabled by default).

![](https://i.gyazo.com/5b70d18f028d27124bd8f4a25b2df47c.png)

When running under HDRP, change color space to linear. HDRP doesn't support gamma mode, which is set by default when creating a new Unity project.

![](https://i.gyazo.com/2c053a6e3d79f080469787b7f09ee8f3.png)

::: example
Check the project on GitHub for an example on how to set up and use URP with Naninovel: [github.com/Naninovel/URP](https://github.com/Naninovel/URP).
:::

## Limitations

Some built-in effects and features, like Depth Of Field, Digital Glitch, [@startTrans] and [@finishTrans] commands may not work with SRPs due to lack of the required rendering features. It's possible to replace most of the missing effects and features via various hacks and use them without modifying Naninovel's source code or package content; see [special effects](/guide/special-effects.md#adding-custom-effects) and [custom commands](/guide/custom-commands.md) guides for more information on extending the engine in that regard.
