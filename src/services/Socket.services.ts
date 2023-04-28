import socketIo, { Server, Socket } from "socket.io";
import { ITask } from "../model/task.model";
import { INotification } from "../model/notification.model";

interface SocketUser {
    socketId: string;
    userId?: number;
    spaceId?: number
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

        this.io.on("connection", (socket: Socket) => {

            this.addNewUser({
                socketId: socket.id
            })

            socket.on("disconnect", () => {
                this.removeUser(socket)
                console.log("A user disconnected");
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
        });
    }

    private addNewUser(data: SocketUser) {
        this.users.push(data)
    }

    private updateUser(socket: Socket, data: Partial<SocketUser>) {
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
}

export default SocketService.createInstance();
