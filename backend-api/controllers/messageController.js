const messageService = require('../services/messageService');



//send a message
exports.sendMessage = async(req, res, next) =>{
    try{
        const message = await messageService.sendMessage(
            req.user.id,
            req.params.conversationId,
            req.body.content
        );
        res.status(201).json({
            status: 'success',
            data: message
        });
    } catch(error){
        next(error);
    }
}


//get all the message in  the conversation
exports.getMessage = async (req, res, next) =>{
    try{
        const messages = messageService.getMessage(req.params.conversationId)
        res.status(201).json({
            status: 'success', 
            data: messages
        })
    } catch(error){
        next(error);
    }
}


//get all conversation for login user
exports.getConversations = async (req, res, next) =>{
        try{
            const conversations = await messageService.getConversations(req.user.id);
            res.status(201).json({
                status: 'success',
                data: conversations
            });

        }catch(error){
            next(error)
        }

}

//Create a new convesation
exports.createConversation = async(req, res, next) =>{
    try{
        const conversation = await messageService.createConversation(req.user.id, req.body.recieverId)
        res.status(2021).json({
            status: 'success',
            data: conversation

        })
    }catch(error){
        next(error);

    }
}


//delete a message
exports.deleteMessage = async (req, res, next) =>{
    try{
        const message = await messageService.deleteMessage(req.params.messageId, req.user.id)
        res.status(201).json({
            status: 'success',
            data: message
        })
    } catch(error){
        next(error);
    }
}