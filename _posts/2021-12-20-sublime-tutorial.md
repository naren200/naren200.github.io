---
title: Sublime and Tmux Shortcuts
tags: [Software Development]
style: fill
color: dark
description: Everyday key shortcuts that I use
---


# Sublime Shortcuts to use

* Cntrl + mouse right click : multiple cursor
* Cntrl + d : select next occurence of word that you had selected
* Slect on thing hold on cntrl and select other : now we can copy paste multiple
* Cntrl + p : go to anything ( get preview of files that you had visited earlier)
* Cntrol + p + : -> allow to navigate tot he line number
* Cntrl +  shift + p -> set the syntax of the file that you want to
* F3 : find next
* Shift + F3 : find previous
* cntrl + shift + F : find in files <br>
Other Resources : <br>
[Other short notes 1](https://w3codemasters.in/sublime-text-split-screen/) <br>
[Short Notes 2](https://generalassemb.ly/blog/sublime-text-3-tips-tricks-shortcuts/#:~:text=If%20you%20want%20to%20split,new%20group%20inside%20a%20pane.)

# Tmux Shortcuts to use (based on my `~/.tmux.conf`)

1. Start new with session name: `tmux new -s myname`
2. Attach to the named session: `tmux a -t myname`
3. List sessions: `tmuz ls`
4. Kill session: `tmux kill-session -t myname`
5. Prefix I use: `C-a`
* Shortcuts with Windows:
	* Create window:`c`
	* List Windows: `w`
	* Next Window: `n`
	* Previous Window: `p`
	* Find Window: `f`
	* Rename Window: `,`
	* Kill Window: `&`

* Shortcuts with panes:
	* Vertical Split: `|`
	* Horizontal Split: `_`

* Switch Panes with `Alt+ <arror_keys>`
* Incse you face incompatiblity with agnoster theme and tmux, use `tmux -u` to intiate tmux

## Resources
1. https://gist.github.com/MohamedAlaa/2961058
2. https://tmuxcheatsheet.com/
3. https://www.hamvocke.com/blog/a-guide-to-customizing-your-tmux-conf/
4. https://github.com/gpakosz/.tmux/blob/master/.tmux.conf

