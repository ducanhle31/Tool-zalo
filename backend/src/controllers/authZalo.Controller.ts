import { Request, Response } from "express";
import { getAuthorizationUrl } from "../services/zalo/zaloAuthService";
import { exchangeCodeForAccessToken } from "../services/zalo/zaloTokenService";

class AuthZaloController {
  public authZalo = (req: Request, res: Response) => {
    const authorizationUrl = getAuthorizationUrl();
    res.redirect(authorizationUrl);
  };

  public callback = async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Authorization code missing");
    }

    try {
      await exchangeCodeForAccessToken(code as string);

      res.send(`
      <html>
        <body>
          <script>
            window.close();
          </script>
        </body>
      </html>
    `);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}

export default new AuthZaloController();
