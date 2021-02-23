export const userResponses = {
    creation: {
        noPermission: {
            code:	1010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        mailExists: {
            code:	1011,
            status: false,
            message: 'The mail is already registered.' 
        },
        documentExists: {
            code:	1012,
            status: false,
            message: 'The identification document is already registered.' 
        },
        usernameExists: {
            code:	1013,
            status: false,
            message: 'The username is already registered.' 
        },
        error: {
            code:	1019,
            status: false,
            message: 'The User could not be created, an error has occurred.' 
        },
        success: {
            code:	1110,
            status: true,
            message: 'The User has been successfully created.' 
        }
    },
    list: {
        noPermission: {
            code:	1030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        notFound: {
            code:	1031,
            status: false,
            message: 'User not found.' 
        },
        error: {
            code:	1039,
            status: false,
            message: 'The User(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	1130,
            status: true,
            message: 'The User(s) has been successfully listed.' 
        }
    },
    delete: {
        noPermission: {
            code:	1060,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	1069,
            status: false,
            message: 'The User could not be deleted, an error has occurred.' 
        },
        success: {
            code:	1160,
            status: true,
            message: 'The User has been successfully deleted.' 
        }
    },
    changePassword: {
        notFitStandard: {
            code:	1070,
            status: false,
            message: 'New password doesn\'t meet security standards.' 
        },
        equalToPrevious: {
            code: 2020,
            status: false,
            message: 'The new password cannot be the same as the old one.' 
        },
        previousInvalid: {
            code:	1071,
            status: false,
            message: 'Previous password invalid.' 
        },
        error: {
            code:	1079,
            status: false,
            message: 'An error has ocurred, password couldn\'t  be changed.' 
        },
        success: {
            code:	1170,
            status: true,
            message: 'Password has been successfully updated.' 
        }

    },
    login: {
        wrongData: {
            code:	1000,
            status: false,
            message: 'Invalid username or password.' 
        },
        loginTypeInvalid: {
            code:	1001,
            status: false,
            message: 'You must use the authentication method previously used.' 
        },
        error: {
            code:	1002,
            status: false,
            message: 'User is not active.' 
        },
        success: {
            code:	1100,
            status: true,
            message: 'Login succesful.' 
        }
    },
    logout: {
        error: {
            code:	1089,
            status: false,
            message: 'User can not logout.' 
        },
        success: {
            code:	1180,
            status: true,
            message: 'Logout Successfully.' 
        }
    },
    refreshToken: {
        cookieNotSent: {
            code:	6,
            status: false,
            message: 'Cookie not sent' 
        },
        notCookies: {
            code:	10030,
            status: false,
            message: 'Cookie empty or not sent' 
        },
        idUserDontMatch: {
            code:	10012,
            status: false,
            message: 'idUser does not match the refreshToken user' 
        },
        refreshNotValid: {
            code: 10010,
            status: false,
            message: 'Invalid Refresh Token'
        },
        tokenNotValid: {
            code: 10020,
            status: false,
            message: 'Invalid token'
        },
        refreshExpired: {
            code: 10030,
            status: false,
            message: 'Expired refresh token'
        },
        success: {
            code: 10111,
            status: true,
            message: 'Succesfull token refresh'
        }
    }
};
