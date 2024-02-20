# Naninovel Scripts

Naninovel scripts are text documents (`.nani` extension) where you control what happens on scenes. Script assets are created with `Create -> Naninovel -> Naninovel Script` asset context menu. You can open and edit them with the built-in [visual editor](#visual-editor) or with an external text editor of your choice, like Microsoft Word, Google Docs or [VS Code](https://code.visualstudio.com).

![](https://i.gyazo.com/f552c2ef323f9ec1171eba72e0c55432.png)

Each line in naninovel script represents a statement, which can be a command, generic text, label or comment. Type of the statement is determined by the literal placed at the start of the line:

| Literal | Statement Type            |
|:-------:|---------------------------|
|    @    | [Command](#command-lines) |
|    #    | [Label](#label-lines)     |
|    ;    | [Comment](#comment-lines) |

When none of the above literals are present at the start of the line, it's considered a [generic text](#generic-text-lines) statement.

## Command Lines

Line is considered a command statement if it starts with `@` literal. Command represents a single operation, that controls what happens on the scene; eg, it can be used to change a background, move a character or load another naninovel script.

### Command Identifier

Right after the command literal a command identifier is expected. This could either be a name of the C# class that implements the command or the command's alias (when applied via `CommandAlias` attribute).

For example, [@save] command (used to auto-save the game) is implemented via `AutoSave` C# class. The implementing class also has `[CommandAlias("save")]` attribute applied, so you can use both `@save` and `@AutoSave` statements in the script to invoke this command.

Command identifiers are case-insensitive; all the following statements are valid and will invoke the same `AutoSave` command:

```nani
@save
@Save
@AutoSave
@autosave
```

### Command Parameters

Most of the commands have a number of parameters that define the effect of the command. Parameter is a key-value expression defined after the command literal separated by a column (`:`). Parameter identifier (key) can be either name of the corresponding parameter field of the command implementation class or the parameter's alias (when defined via `alias` property of `CommandParameter` attribute).

```nani
@commandId paramId:paramValue
```

Consider [@hideChars] command, which is used to hide all visible characters on the scene. It can be used as follows:

```nani
@hideChars
```

You can use `time` *Decimal* parameter here to control how long the characters will fade-out before becoming completely hidden (removed from scene):

```nani
@hideChars time:5.5
```
This will make the characters fade-out for 5.5 seconds, before completely removing them from scene.

### Parameter Value Types

Depending on the command parameter, it can expect one of the following value types:

Type | Description
--- | ---
string | A simple string value, eg: `LoremIpsum`. Don't forget to wrap the string in double quotes in case it contain spaces, eg: `"Lorem ipsum dolor sit amet."`.
integer | A number which is not a fraction; a whole number, eg: `1`, `150`, `-25`.
decimal | A decimal number with fraction delimited by a dot, eg: `1.0`, `12.08`, `-0.005`.
boolean | Can have one of two possible values: `true` or `false` (case-insensitive).
named | A name string associated with a value of one of the above types. The name part is delimited by a dot. Eg for named integer: `foo.8`, `bar.-20`.
list | A comma-separated list of values of one of the above types. Eg for string list: `foo,bar,"Lorem ipsum."`, for decimal list: `12,-8,0.105,2`

### Nameless Parameters

Most commands have a nameless parameter. A parameter is considered nameless when it can be used without specifying its name.

For example, [@bgm] command expects a nameless parameter specifying name of the music track to play:

```nani
@bgm PianoTheme
```
"PianoTheme" here is the value of "BgmPath" *String* parameter.

There can be only one nameless parameter per command and it should always be specified before any other parameters.

### Optional and Required Parameters

Most of the command parameters are *optional*. It means they either have a predefined value or just don't require any value in order for the command to be executed. For example, when [@resetText] command is used without specifying any parameters it will reset text of a default printer, but you can also set a specific printer ID like this: `@resetText printer:Dialogue`.

Some parameters however are *required* in order for the command to execute and should always be specified.

### Commands API Reference

For the list of all the currently available commands with a summary, parameters and usage examples see [commands API reference](/api/).

## Generic Text Lines

To make writing scripts with large amounts of text easier generic text lines are used. Line is considered a generic text statement when it doesn't start with any of the predefined statement literals:

```nani
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```

An author ID can be specified at the start of a generic text line separated by a column followed with space ((`: `)) to associate printed text with a [character actor](/guide/characters):

```nani
Felix: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```

To save some typing when constantly changing character appearances associated with printed text, you can also specify appearance after the author ID:

```nani
Felix.Happy: Lorem ipsum dolor sit amet.
```

The above line is equal to the following two:

```nani
@char Felix.Happy wait:false
Felix: Lorem ipsum dolor sit amet.
```

### Command Inlining

Sometimes, you may want to execute a command while revealing (printing) text message, right after or before specific character. For example, an actor would change their appearance (expression) when a specific word is printed or a particular sound effect would be played in reaction to some event described in the midst of a printed message. Command inlining feature allows handling cases like that.

All the commands (both [built-in](/api/) and [custom ones](/guide/custom-commands)) can be inlined (injected) to generic text lines using square brackets (`[ ]`):

```nani
Felix: Lorem ipsum[char Felix.Happy pos:0.75 wait:false] dolor sit amet, consectetur adipiscing elit.[i] Aenean tempus eleifend ante, ac molestie metus condimentum quis.[i][br 2] Morbi nunc magna, consequat posuere consectetur in, dapibus consectetur lorem. Duis consectetur semper augue nec pharetra.
```

Notice, that the inlined command syntax is exactly the same, except `@` literal is omitted and command body is wrapped in square brackets. Basically, you can take any command line, inline it to a generic text and it will have the exact same effect, but at a different moment, depending on the position inside text message.

Under the hood, generic text lines are parsed into individual commands identified by inline index; text is printed with [@print] command. For example, following generic text line:

```nani
Lorem ipsum[char Felix.Happy pos:75 wait:false] dolor sit amet.
```

— is actually handled by the engine as a sequence of individual commands:

```nani
@print "Lorem ipsum" waitInput:false
@char Felix.Happy pos:75 wait:false
@print "dolor sit amet."
```

To actually print square brackets within generic text line, escape them with backslashes, eg:
```nani
Some text \[ text inside brackets \]
```

— will print "Some text [ text inside brackets ]" in-game.

## Label Lines

Labels are used as "anchors" when navigating naninovel scripts with [@goto] commands. To define a label, use `#` literal at the start of the line followed with label name:

```nani
# Epilogue
```

You can then use [@goto] command to "jump" to that line:

```nani
@goto ScriptName.Epilogue
```

When both [@goto] and target label are in the same script, you can omit script name:

```nani
@goto .Epilogue
```

## Comment Lines

When line starts with semicolon literal (`;`) it's considered a comment statement. Comment lines are completely ignored by the engine when scripts are parsed. Use comment lines to add notes or annotations for yourself or other team members working with naninovel scripts.

```nani
; The following command will auto-save the game.
@save
```

## Wait Flags

Wait flags are `>` and `<` symbols specified at the end of command. Use them to control whether next command should be executed immediately after or wait for the completion of the current command, eg:

```nani
@snow >
@camera zoom:0.5 >
Kohaku: Looks like it's starting to snow.
```

— will start printing the generic line without waiting for snow FX and zoom camera commands to complete, making all the commands run in parallel.

If you find yourself specifying `>` more often than not, consider disabling `Wait By Default` option in script player configuration; this way script player won't wait the commands:

```nani
@snow
@camera zoom:0.5
Kohaku: Looks like it's starting to snow.
```

— given `Wait By Default` is disabled, above will work same as before, without the need to specify wait flags. If you'd want to wait for command completion with default wait disabled, use reverse wait flag:

```nani
@snow
@camera zoom:0.5 <
Kohaku: Looks like it's starting to snow.
```

— will wait for zoom to complete before starting to print the generic line.

Wait flags can be used inside inlined commands as well, eg:

```nani
Kohaku: Printed before shake[shake Kohaku >] printing while Kohaku is shaking.
```

::: info NOTE
Wait flags are shortcuts for specifying `wait` parameter. When command ends with `>` it's parsed as if it has `wait:false` parameter, while `<` is parsed as `wait:true`. When both wait parameter and wait flag are specified, wait flag overrides effect of the wait parameter.
:::

## Conditional Execution

While the script are executed in a linear fashion by default, you can introduce branching using `if` parameters supported by all the commands.

```nani
; If `level` value is a number and is greater than 9000, add the choice.
@choice "It's over 9000!" if:level>9000

; If `dead` variable is a false boolean, execute the print command.
@print text:"I'm still alive." if:!dead

; If `glitch` is a true boolean or random function in 1 to 10 range
; returns 5 or more, execute `@spawn` command.
@spawn GlitchCamera if:"glitch || Random(1, 10) >= 5"

; If `score` value is in 7 to 13 range or `lucky` variable
; is a true boolean, load `LuckyEnd` script.
@goto LuckyEnd if:"(score >= 7 && score <= 13) || lucky"

; You can also use conditionals in the inlined commands.
Lorem sit amet. [style bold if:score>=10]Consectetur elit.[style default]

; When using double quotes inside the expression itself,
; don't forget to escape them.
@print {remark} if:remark=="Saying \"Stop the car\" was a mistake."
```

It's also possible to specify multi-line conditional blocks with [@if], [@else], [@elseif] and [@endif] commands.

```nani
@if score>10
	Good job, you've passed the test!
	@bgm Victory
	@spawn Fireworks
@elseif attempts>100
	You're hopeless... Need help?
	@choice "Yeah, please!" goto:.GetHelp
	@choice "I'll keep trying." goto:.BeginTest
	@stop
@else
	You've failed. Try again!
	@goto .BeginTest
@endif
```

::: info NOTE
The tabs in the above sample are used for better readability and are completely optional. Naninovel ignores any kind of white space (spaces, tabs, etc) before and after command and label lines, so that you can format them as you see fit.
:::

The same works for generic text lines:

```nani
Lorem ipsum dolor sit amet. [if score>10]Duis efficitur imperdiet nunc. [else]Vestibulum sit amet dolor non dolor placerat vehicula.[endif]
```

For more information on the conditional expression format and available operators see [script expressions](/guide/script-expressions) guide.

## Title Script

Title script is a special naninovel script assigned in script configuration menu. When assigned, it's automatically played when the title UI (main menu) is shown. Title script can be used to set up the title screen scene: background, music, effects, etc.

The script can also be used to invoke commands when player clicks "NEW GAME", "EXIT" or any of the save slots to load a game. Below is an example of a title script.

```nani
; Following commands are played when entering the main menu.
; Notice, they're not awaited so that title UI is shown at the same time.
@back MainMenuBackground time:3 wait:false
@bgm MainMenuMusic wait:false
@spawn Rain wait:false
@stop

# OnNewGame
; Following commands will be executed when player clicks "NEW GAME".
; Notice, that `stopBgm` command is awaited, so that the music
; is fully stopped before new game begin to load.
@sfx NewGameSoundEffect wait:false
@stopBgm
@stop

# OnLoad
; Below commands will be executed when player loads a saved game.
@sfx LoadGameEffect
@wait 0.5
@stop

# OnExit
; Below commands will be executed when player clicks "EXIT".
@sfx ExitGameEffect
@wait 1.5
@stop

```

## Visual Editor

You can use visual script editor to edit the naninovel scripts. Select a script asset and you'll see the visual editor automatically open in the inspector window.

![](https://i.gyazo.com/ba57b9f78116e57408125325bdf66be9.mp4)

To add a new line to the script, either right-click the place, where you want to insert the line, or press `Ctrl+Space` (you can change the default key bindings in the input configuration menu) and select the desired line or command type. To re-order lines, drag them using their number labels. To remove a line, right-click it and choose "Remove".

When you've changed the script using visual editor, you'll see an asterisk (`*`) over the script name in the inspector header. That means the asset is dirty and need to be saved; press `Ctrl+S` to save the asset. In case you'll attempt to select another asset while the script is dirty, a dialogue window will pop-up allowing to either save or revert the changes.

The visual editor will automatically sync edited script if you update it externally, so you can seamlessly work with the scripts in both text and visual editors. In case auto-sync is not working, make sure `Auto Refresh` is enabled in the `Edit -> Preferences -> General` Unity editor menu.

During the playmode, you can use visual editor to track which script line is currently being played and use context menu (or click a line while holding `Shift`) to rewind the playback. This feature requires the script to have equal resource ID (when assigned in the resources manager menu) and asset name.

![](https://i.gyazo.com/b6e04d664ce4b513296b378b7c25be03.mp4)

Currently played line will be highlighted with green color; when script playback is halted due waiting for user input, played line will be highlighted with yellow instead.

You can tweak the editor behavior and looks in the scripts configuration menu.

![](https://i.gyazo.com/7d29e700e87223c4c94143d50380c474.png)

![](https://www.youtube.com/watch?v=9UmccF9R9xI)

## Script Graph

When working with large amount of scripts and non-linear stories, it could become handy to have some kind of visual representation of the story flow. This is where script graph tool comes in handy.

![](https://i.gyazo.com/0dd3ec2393807fb03d501028e1526895.mp4)

To open the graph window use `Naninovel -> Script Graph` editor menu. You can dock the window as any other editor panel if you like to.

The tool will automatically build graph representation of all the naninovel scripts (represented as nodes) assigned via editor resources (`Naninovel -> Resources -> Scripts`) and connections between them.

The connections are generated based on [@goto], [@gosub] and [@choice] (when it has a `goto` parameter) commands. If the command has a conditional expression assigned (`if` parameter), corresponding port in the node will be highlighted with yellow and you'll be able to see the expression when hovering the port.

You can select script asset and open visual editor by double-clicking nodes or clicking ports. Clicking the ports will also scroll the visual editor to a line containing label (in case there were a label specified).

You can re-position the nodes as you like and their positions will be automatically saved when closing the graph window or exiting Unity; the positions will then be restored when re-open the window. You can also save manually by clicking "Save" button. Clicking "Auto Align" button will reset all the positions.

When changing scripts or adding new ones, click "Rebuild Graph" button to sync it.

When [comment lines](/guide/naninovel-scripts#comment-lines) are present at the top of a script, associated graph node will show those as a synopsis. To disable that, uncheck `Show Synopsis` in the scripts configuration menu.

![](https://i.gyazo.com/15682b202d37ad8f12b0f839063a530f.png)

## Hot Reload

It's possible to edit scripts at play mode (via both visual and external editors) and have the changes applied immediately, without game restart. The feature is controlled via `Hot Reload Scripts` property in the scripts configuration and is enabled by default.

When modifying, adding or removing a line before the currently played one, state rollback will automatically happen to the modified line to prevent state inconsistency.

In case hot reload is not working, make sure `Auto Refresh` is enabled and `Script Changes While Playing` is set to `Recompile And Continue Playing`. Both properties can be found at `Edit -> Preferences -> General` Unity editor menu.

![](https://i.gyazo.com/5d433783e1a12531c79fe6be80c92da7.png)

To manually initiate hot reload of the currently played naninovel script (eg, when editing script file outside of Unity project), use `reload` [console command](/guide/development-console). The command is editor-only (won't work in builds).

## IDE Support

IDE features, like syntax highlighting, error checking, auto-completion and interactive documentation could significantly increase productivity when writing scripts. We've made an extension for a free and open-source [VS Code editor](https://code.visualstudio.com) (available for Windows, MacOS and Linux), which provides the essential IDE support for NaniScript syntax.

![](https://i.gyazo.com/b1f5c6845c04d1b18b2196aa29ea6c19.png)

For more information on how to install and use the extension see the [IDE extension guide](/guide/ide-extension).

## Scripts Debug

When working with large naninovel scripts, it could become tedious to always play them from start in order to check how things work in particular parts of the script.

Using [development console](/guide/development-console) you can instantly "rewind" currently played script to an arbitrary line:

```
rewind 12
```

— will start playing current script from the 12th line; you can rewind forward and backward in the same way. To open the console while game is running, make sure the console is enabled in the engine configuration and press `~` key (can be changed in the configuration) or perform multi-touch (3 or more simultaneous touches) in case the build is running on a touchscreen device.

To find out which script and line is currently playing, use debug window: type `debug` in the development console and press `Enter` to show the window.

![Scripts Debug](https://i.gyazo.com/12772ecc7c14011bcde4a74c81e997b8.png)

Currently played script name, line number and command (inline) index are displayed in the title of the window. When [auto voicing](/guide/voicing#auto-voicing) feature is enabled, name of the corresponding voice clip will also be displayed. You can re-position the window by dragging it by the title. "Stop" button will halt script execution; when script player is stopped "Play" button will resume the execution. You can close the debug window by pressing the "Close" button.

Debug window is available in both editor and player builds.

## Text Identification

Features like [script localization](/guide/localization#scripts-localization) and [auto voicing](/guide/voicing#auto-voicing) require associating text written in Naninovel scenario scripts with other resources; for example translated text to show instead of the associated one or voice clip to play when associated text is printed. For this to work we have to assign each such text a unique identifier.

By default, Naninovel will automatically identify all the localizable text by its content hash when importing script assets. This works fine as long as you don't modify the text; but after you do, all the associations will break: you'll have to re-map auto voice clips or re-translate changed text statements.

To prevent associations from breaking when editing text, enable `Stable Identification` under scripts configuration menu. When enabled, Naninovel will explicitly write unique IDs to each localizable text in imported scripts. The downside is that the script text will now have IDs appended to each localizable parameter, eg:
```nani
Kohaku: Hey!|#1|[i] What's up?|#2|
@choice "Option 1|#3|"
@choice "Option 2|#4|"
```
— but in return, as long as you don't remove or change the IDs, the associations won't break. To make text IDs less distracting, they are colored dim by the IDE extension and visual editor.

When stable identification is enabled, the system will also make sure all the generated text IDs are unique and were never used before inside the script document; for this, it'll store latest revision numbers in `NaninovelData/ScriptRevisions` editor asset. Whenever you remove a line with an assigned text ID, you can be sure that this ID won't suddenly appear in some other place (unless you specify it manually).
