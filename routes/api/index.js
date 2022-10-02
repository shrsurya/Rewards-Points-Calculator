var router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name: Rewards API
 *  description: API for CapitalOne Rewards Calculator
 */


/**
 *@swagger 
 *components:
 *  schemas:
 *      RewardsRequest:
 *          type: object
 *          required:
 *              - TxnID:
 *                  - date
 *                  - merchant_code
 *                  - amount_cents 
 *          example:
 *              {
 *                   "T01": {
 *                       "date": "2021-05-01",
 *                       "merchant_code": "sportcheck",
 *                       "amount_cents": 2500
 *                   },
 *                   "T02": {
 *                       "date": "2021-05-02",
 *                       "merchant_code": "tim_hortans",
 *                       "amount_cents": 1000
 *                   },
 *                   "T03": {
 *                       "date": "2021-05-03",
 *                       "merchant_code": "the_bay",
 *                       "amount_cents": 500
 *                   }
 *              }
 *      RewardsResponse:
 *          type: object
 *          properties:
 *              TotalPoints:
 *                  type: Number 
 *                  description: Total rewards earned
 *              IndividualPoints:
 *                  type: object
 *                  description: Distribution of points
 *          example:
 *              TotalPoints: 95,
 *              IndividualPoints: {
 *                  "T01": 80,
 *                  "T02": 10,
 *                  "T03": 5
 *              }
 * 
 */


/**
 * @swagger
 * /api/rewards:
 *  post:
 *      summary: Provide monthly user transactions
 *      tags: [Rewards API]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RewardsRequest'
 *      responses:
 *          200:
 *              description: Reward points distribution successful
 *              content:
 *                  application/json:
 *                    schema:
 *                      $ref: '#/components/schemas/RewardsResponse'
 * 
 */
router.use("/rewards", require("./rewards"));

module.exports = router;
