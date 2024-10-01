cd build-vercel
mkdir -p ./node_modules
cat ../package.json > ./package.json
r1=$(npm i --production --registry=https://registry.npmmirror.com)

cd ..
req=$(find ./server build-vercel/node_modules -type f|grep -v .DS_Store|sed 's/build-vercel\/node_modules\///g'|sed 's/^/require\("/g'|sed 's/$/");/g')
echo 'const _require=require; require=_=>{};' >app.js
echo $req >>app.js
echo 'require=_require;' >>app.js
cat build-vercel/_app.js >>app.js

echo "-- build app.js completed --"