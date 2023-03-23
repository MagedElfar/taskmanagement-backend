import { GetCommentsDto } from './../dto/comment.dto';
import { CommentRepository, IComment } from './../model/comment.model';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';

@Service()
export default class CommentServices {
    private readonly commentRepository: CommentRepository;

    constructor(
        @Inject() commentRepository: CommentRepository,
    ) {
        this.commentRepository = commentRepository;
    }


    async find(getCommentsDto: GetCommentsDto) {
        try {
            return await this.commentRepository.find(getCommentsDto)
        } catch (error) {
            throw error
        }
    }



    async addComment(userId: number, data: Partial<IComment>) {
        try {

            const media: any = [];

            return await this.commentRepository.create({
                ...data,
                userId,
            });


        } catch (error) {

            throw error;
        }
    }

    async deleteComment(userId: number, commentId: number) {
        try {
            const comment = await this.commentRepository.findOne(commentId);

            if (!comment || comment.userId !== userId) throw setError(403, "Forbidden")


            await this.commentRepository.delete(commentId)

        } catch (error) {
            throw error;
        }
    }

}
