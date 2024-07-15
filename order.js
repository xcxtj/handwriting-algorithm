//层序
const queue=[root]
while(queue.length){
    const level=queue.length
    const res=[]
    for(let i=0;i<level;++i){
        const node=queue.shift()
        res.push(node.val)
        // ...........
        queue.push//node左右
    }
    if(queue.legnth){
        // 需要层数
    }
}