import { ObjectId } from 'mongodb'
import { SurveyResultRepository } from '../../../../data/protocols/survey-result-repository'
import { SurveyResultModel } from '../../../../domain/models/survey'
import { SaveSurveyResultModel } from '../../../../domain/usecases/survey'
import { MongoHelper } from '../mongo-helper/mongo-helper'

export class SurveyResultMongoRepository implements SurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      userId: new ObjectId(data.userId)
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true
    })
    const surveyResult = await this.loadBySurveyId(data.surveyId.toString())
    return surveyResult
  }

  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const query = surveyResultCollection.aggregate([
      {
        $match: {
          surveyId: new ObjectId(surveyId)
        }
      },
      {
        $group: {
          _id: 0,
          data: {
            $push: '$$ROOT'
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $unwind: {
          path: '$data'
        }
      },
      {
        $lookup: {
          from: 'surveys',
          foreignField: '_id',
          localField: 'data.surveyId',
          as: 'survey'
        }
      },
      {
        $unwind: {
          path: '$survey'
        }
      },
      {
        $group: {
          _id: {
            surveyId: '$survey._id',
            question: '$survey.question',
            date: '$survey.date',
            total: '$count',
            answers: '$survey.answers'
          },
          votes: {
            $push: '$data.answer'
          }
        }
      },
      {
        $unwind: {
          path: '$_id.answers'
        }
      },
      {
        $addFields: {
          answerCount: {
            $size: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: { $eq: ['$$vote', '$_id.answers.answer'] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          percent: {
            $multiply: [
              {
                $divide: ['$answerCount', '$_id.total']
              },
              100
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            surveyId: '$_id.surveyId',
            question: '$_id.question',
            date: '$_id.date'
          },
          answers: {
            $push: {
              answer: '$_id.answers.answer',
              count: '$answerCount',
              percent: '$percent'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: {
            $sortArray: {
              input: '$answers',
              sortBy: { percent: -1 }
            }
          }
        }
      }
    ])
    const surveyResult = await query.toArray()
    return Promise.resolve(surveyResult?.[0] as SurveyResultModel)
  }
}
