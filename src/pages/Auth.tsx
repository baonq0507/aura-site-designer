import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState(""); // For phone/username/email login
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fundPassword, setFundPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showFundPassword, setShowFundPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "signin";
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let emailToUse = loginIdentifier;

      // Check if the input is not an email (doesn't contain @)
      if (!loginIdentifier.includes('@')) {
        // Try to find user by phone number or username
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('user_id')
          .or(`phone_number.eq.${loginIdentifier},username.eq.${loginIdentifier}`)
          .limit(1);

        if (profileError) {
          throw new Error('Error searching for user');
        }

        if (!profiles || profiles.length === 0) {
          toast({
            variant: "destructive",
            title: t('auth.signin.failed'),
            description: t('auth.signin.user.not.found'),
          });
          setIsLoading(false);
          return;
        }

        // Get email from auth user
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profiles[0].user_id);
        
        if (authError || !authUser.user?.email) {
          toast({
            variant: "destructive",
            title: t('auth.signin.failed'),
            description: t('auth.signin.user.not.found'),
          });
          setIsLoading(false);
          return;
        }

        emailToUse = authUser.user.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: t('auth.signin.failed'),
          description: error.message === "Invalid login credentials" 
            ? t('auth.signin.invalid.credentials')
            : error.message,
        });
      } else {
        toast({
          title: t('auth.signin.success'),
          description: t('auth.signin.welcome.back'),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: t('auth.signin.error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !phoneNumber || !fundPassword) {
      toast({
        variant: "destructive",
        title: t('auth.signup.failed'),
        description: t('auth.signup.fill.all.fields'),
      });
      setIsLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username,
            phone_number: phoneNumber,
            fund_password: fundPassword,
            invitation_code: invitationCode,
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: t('auth.signup.failed'),
            description: t('auth.signup.email.already.registered'),
          });
        } else {
          toast({
            variant: "destructive",
            title: t('auth.signup.failed'),
            description: error.message,
          });
        }
      } else {
        toast({
          title: t('auth.signup.success'),
          description: t('auth.signup.check.email'),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: t('auth.signup.error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6 border-accent/30 hover:bg-accent/20 hover:border-accent transition-all duration-200"
        >
          <ArrowLeft className="w-4 w-4 mr-2" />
          {t('auth.back.to.homepage')}
        </Button>

        <Card className="bg-card border-accent/20 shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              {t('auth.title')}
            </CardTitle>
            <CardDescription>
              {t('auth.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger value="signin">{t('auth.signin')}</TabsTrigger>
                <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-identifier">{t('auth.login.identifier')}</Label>
                    <Input
                      id="signin-identifier"
                      type="text"
                      placeholder={t('auth.login.identifier.placeholder')}
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                      className="bg-background border-accent/20 focus:border-accent"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('auth.login.identifier.hint')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t('auth.password')}</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-background border-accent/20 focus:border-accent"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:bg-gradient-luxury hover:scale-105 text-black font-semibold transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.signin')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">{t('auth.username')}</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder={t('auth.username.placeholder')}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-background border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">{t('auth.phone.number')}</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder={t('auth.phone.placeholder')}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="bg-background border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('auth.email')}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder={t('auth.email.placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('auth.login.password')}</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-background border-accent/20 focus:border-accent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('auth.password.min.length')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-fund-password">{t('auth.fund.password')}</Label>
                    <div className="relative">
                      <Input
                        id="signup-fund-password"
                        type={showFundPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={fundPassword}
                        onChange={(e) => setFundPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-background border-accent/20 focus:border-accent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowFundPassword(!showFundPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showFundPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-invitation">{t('auth.invitation.code.optional')}</Label>
                    <Input
                      id="signup-invitation"
                      type="text"
                      placeholder={t('auth.invitation.code.placeholder')}
                      value={invitationCode}
                      onChange={(e) => setInvitationCode(e.target.value)}
                      className="bg-background border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="w-4 h-4 text-primary bg-background border-accent/20 rounded focus:ring-primary"
                    />
                    <Label htmlFor="terms" className="text-sm">
                      {t('auth.agree.with')}{" "}
                      <span className="text-primary hover:underline cursor-pointer">
                        {t('auth.terms.of.service')}
                      </span>
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:bg-gradient-luxury hover:scale-105 text-black font-semibold transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.signup')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;