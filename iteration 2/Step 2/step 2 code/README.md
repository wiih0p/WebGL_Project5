# CS452-Starter
Starter code for CS452 - Computer Graphics

## Compatibility

Check if your browser is usable here:

https://get.webgl.org/webgl2/

Here is a copy of the Starter Running on Hydra, from my Directory:

http://web.eecs.utk.edu/~pprovins/sample/

## Serving

These files can be ran locally so that you may test without pinging the hydra machine (so you can work offline, or in the event Hydra is powered off). You must run from a browser compatible with WebGL2 and a computer made in the last half century.

If you have python3 installed:

```
cd ~/starter/code/dir/containing/index_file
python3 -m http.server 5000
```

If you have npm installed (recommended)

1) Install serve (it is a global install, be warned!)
2) serve the dir

```
npm i -g serve
cd ~/starter/code/dir/containing/index_file
serve
```

## Hydra Deployment

I need to be able to access your lab via the url scheme:

`http://web.eecs.utk.edu/~NETID/YOUR_HASH/lab#/step#`

So, my lab1, step 1 would be available via:

`http://web.eecs.utk.edu/~pprovins/vexed_geiger/lab1/step1`

Make sure your perms are right too!

0) Make sure your webhome directory exists, and it has the permissions of `711`.
1) Make your hash directory
2) Change your hash directory permisions
3) Whenever lab is due, copy files over for that step to your dir and 
4) Give files read permission
5) Give dirs execute permission (755 will allow another user to read contents, try visiting `http://web.eecs.utk.edu/~pprovins/vexed_geiger/lab1` and you get a permission denied. This will keep other students/onlookers from guessing your hashed dir and stealing your brainpower).
6) Repeat 3, 4, 5 for each lab
```
cd ~/webhome
mkdir MyHash
chmod 711 MyHash
# cp lab files or whatever to MyHash
cd ~/webhome/MyHash
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 711 {} \;
```

## FAQ
just shoot me an email (pprovins@vols.utk.edu), we can grow this portion.

### How can I fork/clone this and add it to my repo in the organization?
```
(assuming you have a repository given to you already)
git clone https://github.com/CS452-SP21/StarterCode.git
cd StarterCode
git remote set-url origin git@github.com:CS452-SP21/MY_GIVEN_REPO
git push origin master 
```

The code you edit will now push to the repo you have setup.

### How can I easily track which lab/step that I am working on?

Take a peak here: `https://git-scm.com/book/en/v2/Git-Basics-Tagging`

When you are done with a step, you may tag it with an annotated tag _before you push_, `git tag -a lab1.step0 -m "lab 1 step 0 complete here"`

Now, you can push and include your tags with the commits `git push --tags` or `git push origin --tags`

If you want to checkout the code at that particular tag: `git checkout lab1.step0`

If you go to GitHub, you can actually create a release for a tag and download that release and copy the contents over, alternatively you checkout the directory at a particular tag and cp files to the specified lab directory.

### Can I use X library with my code?

If I have to run `npm install` to get your code working, you are not going to get any points. The starter code comes with a lot of functionality and a gl-matrix library any more libraries would be excessive for the scope of this course. I will permit JQuery though. Make sure it is a static include and comes bundled with your code. No `CDNs` may be used.

### I have tried to do X but the program is slow. What is the deal?

To be honest the code you write in these labs should not be taxing to your GPU.
Key word being _should_.
You will get varying performance depending on your hardware and how you have your code setup.
Right now, we are not utilizing a key feature of WebGL2 - the vertex array object.
At every render call for a drawable object the starter code must rebind all buffers.
This is expensive, and can be fixed with a vertex array object.
Read more here: https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html
On top of this, you are probably utilizing the `getFlattened` method from the obj loader.
This function creates massive buffers compared to an indexed buffer (read more here: https://webglfundamentals.org/webgl/lessons/webgl-indexed-vertices.html ).
To speed up your code if you are hitting bottlenecks I would encourage you to investigate Indexed Buffers as well as Vertex Array Objects.
