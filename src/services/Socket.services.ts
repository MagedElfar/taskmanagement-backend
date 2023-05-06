import socketIo, { Server, Socket } from "socket.io";
import { ITask } from "../model/task.model";
import { INotification } from "../model/notification.model";
import { IMessage } from "../model/message.model";
import { IMessageReceiver } from "../model/message_receivers.model";
import { IContacts } from "../model/contacts.model";

interface SocketUser {
    socketId: string;
    userId?: number;
    spaceId?: number,
}

class SocketService {
    private static instance: SocketService;
    private io: Server;
    private users: SocketUser[]

    private constructor() {
        this.users = []
    }

    static createInstance(): SocketService {
        if (!this.instance) this.instance = new SocketService();

        return this.instance
    }

    initIo(server: any) {
        this.io = new Server(server, {
            cors: {
                origin: 'http://localhost:3000'
            }
        });

        this.io.emit("onlineUsers", this.users)


        this.io.on("connection", (socket: Socket) => {


            this.addNewUser({
                socketId: socket.id,
            })



            socket.on("disconnect", () => {
                this.removeUser(socket)
                this.io.emit("onlineUsers", this.users)
            });

            socket.on("newContact", (data: Partial<SocketUser>) => {

                this.updateUser(socket, data);

                socket.rooms.forEach(room => {
                    console.log(room);

                    if (room.includes("space")) {
                        socket.leave(room)
                    }
                })

                socket.join(`space-${data.spaceId}-room`)

                this.io.emit("onlineUsers", this.users)
            });

            //tasks

            socket.on("createTask", (data: ITask) => {
                socket.to(`space-${data.spaceId}-room`).emit("createTask", data)
            })

            socket.on("updateTask", (data: ITask) => {
                socket.to(`space-${data.spaceId}-room`).emit("updateTask", data)
            })

            socket.on("deleteTask", (data) => {
                socket.to(`space-${data.spaceId}-room`).emit("deleteTask", data.taskId)
            })

            socket.on("updateAllTasks", (data) => {

                const { spaceId, ...others } = data;

                socket.to(`space-${spaceId}-room`).emit("updateAllTasks", others)
            })

            socket.on("archiveTask", (data) => {
                socket.to(`space-${data.task.spaceId}-room`).emit("archiveTask", data)
            })

            //chat room
            socket.on("joinChatRoom", (data) => {
                console.log("user join")
                socket.join(`privateChat-${data.chatId}`)
            })

            socket.on("leaveChatRoom", (data) => {
                console.log("user leave")
                socket.leave(`privateChat-${data.chatId}`)
            })
        });
    }

    private addNewUser(data: SocketUser) {
        this.users.push(data)
    }

    private updateUser(socket: Socket, data: Partial<SocketUser>) {
        console.log("new user", data)
        if (!this.users.some(item => item.socketId === socket.id)) {
            this.users = [
                ...this.users,
                {
                    socketId: socket.id,
                    // socket,
                    ...data
                }
            ]

            return;
        }
        this.users = this.users.map(user => {
            if (socket.id === user.socketId) {
                return {
                    ...user,
                    ...data
                }
            }

            else return user
        })
    }

    private removeUser(socket: Socket) {
        this.users = this.users.filter(user => socket.id !== user.socketId)
    }

    emitNotification(notification: INotification) {
        const user = this.users.find(user => user.userId === notification.receiver);

        if (!user) return;
        this.io.to(user.socketId).emit("notification", notification)
    }

    emitNewConnection(data: IContacts, userId: number) {
        const user = this.users.find(user => user.userId === userId);

        console.log(data)
        if (!user) return;
        this.io.to(user.socketId).emit("newChatConnection", data)
    }

    emitMassage(message: IMessage) {
        // const user = this.users.find(user => user.userId === notification.receiver);

        this.io.to(`privateChat-${message.conversation_id}`).emit("newMessage", message)
    }

    emitDeleteMassage(message: IMessage) {
        // const user = this.users.find(user => user.userId === notification.receiver);

        this.io.to(`privateChat-${message.conversation_id}`).emit("deleteMessage", message)
    }

    emitUnreadMassage(message: IMessage, contacts: { user_Id: number }[]): Partial<IMessageReceiver>[] {

        const receivers: Partial<IMessageReceiver>[] = []

        contacts.forEach(contact => {
            const socketUser = this.users.find(user => user.userId === contact.user_Id);

            if (!socketUser) {
                receivers.push({
                    message_id: message.id,
                    receiver_id: contact.user_Id,
                })

                return;
            }

            const rooms = this.io.sockets.adapter.sids.get(socketUser.socketId);

            console.log(rooms)

            if (rooms?.has(`privateChat-${message.conversation_id}`)) {
                console.log("mmmmmm")
                receivers.push({
                    message_id: message.id,
                    receiver_id: contact.user_Id,
                    is_read: true
                })
            } else {
                receivers.push({
                    message_id: message.id,
                    receiver_id: contact.user_Id,
                })

                this.io.to(socketUser.socketId).emit("newUnReadMessage", message)
            }

            return;
        });

        return receivers;

    }
}

export default SocketService.createInstance();
